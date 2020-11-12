import json
import requests
import pandas as pd

from datetime import datetime, timedelta

from airflow import DAG
from airflow.hooks.S3_hook import S3Hook
from airflow.operators.python_operator import PythonOperator

# 1. A list of the names of US States
state_names = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas',
    'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii',
    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
    'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

# A mapping of Abbreviation -> Full length for each US State
state_name_map = {
    'ME': 'Maine', 'NH': 'New Hampshire', 'VT': 'Vermont',
    'MA': 'Massachusetts', 'RI': 'Rhode Island', 'CT': 'Connecticut',
    'NY': 'New York', 'NJ': 'New Jersey', 'PA': 'Pennsylvania',
    'DE': 'Delaware', 'MD': 'Maryland', 'VA': 'Virginia',
    'NC': 'North Carolina', 'SC': 'South Carolina', 'GA': 'Georgia',
    'FL': 'Florida', 'KY': 'Kentucky', 'WV': 'West Virginia',
    'OH': 'Ohio', 'IN': 'Indiana', 'MI': 'Michigan', 'AL': 'Alabama',
    'TN': 'Tennessee', 'IL': 'Illinois', 'WI': 'Wisconsin', 'MN': 'Minnesota',
    'MS': 'Mississippi', 'IA': 'Iowa', 'MO': 'Missouri', 'AR': 'Arkansas',
    'LA': 'Louisiana', 'ND': 'North Dakota', 'SD': 'South Dakota',
    'NE': 'Nebraska', 'KS': 'Kansas', 'OK': 'Oklahoma', 'TX': 'Texas',
    'NM': 'New Mexico', 'CO': 'Colorado', 'WY': 'Wyoming', 'MT': 'Montana',
    'ID': 'Idaho', 'UT': 'Utah', 'AZ': 'Arizona', 'WA': 'Washington',
    'OR': 'Oregon', 'NV': 'Nevada', 'CA': 'California', 'AK': 'Alaska',
    'HI': 'Hawaii'
}

default_args = {
    'owner': 'c19insights',
    'depends_on_past': False,
    'start_date': datetime(2020, 10, 22),
    'email': ['robertchecco.code@gmail.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=2),
}

dag = DAG(dag_id='c19-pipeline', default_args=default_args)


def s3_bucket():
    # FIXME replace this with a dynamically labeled bucket name
    BUCKET_NAME = "c19-airflow-2020"
    s3_hook = S3Hook(aws_conn_id="s3_connection")

    exists_a_bucket = s3_hook.check_for_bucket(
        bucket_name=BUCKET_NAME,
    )

    if exists_a_bucket == False:
        s3_hook.create_bucket(
            bucket_name=BUCKET_NAME,
            region_name="us-east-2",
        )


create_s3_bucket = PythonOperator(
    task_id="create_s3_bucket",
    python_callable=s3_bucket,
    dag=dag,
)


def process_nyt_data():
    NYT_URL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv"
    data = pd.read_csv(NYT_URL)
    json_data = data.reset_index().to_json(orient="records")

    # Inputs:
    # state_data: a list of dictionaries containing cumulative data
    # measurement: string, 'cases' || 'deaths'
    # Returns an list of dictionaries containing x,y points
    def process_us_state(state_data, measurement):
        return_data = []
        for i in range(len(state_data)):
            data_point = {}
            if (i == 0):
                data_point['x'] = state_data[i]['date']
                data_point['y'] = state_data[i][measurement]
            else:
                count_today = state_data[i][measurement]
                count_yesterday = state_data[i-1][measurement]
                data_point['x'] = state_data[i]['date']
                data_point['y'] = count_today - count_yesterday
            return_data.append(data_point)
        return return_data

    def create_daily_data_structure_for_ui(data, measurement):

        # 1. Create a dictionary to be returned from function
        data_structure = {}

        # 2. Loop through each state,
        #    Apply data transformation
        #    And assign data to data_structure dictionary

        for us_state in state_names:
            # For the current US State
            # a. Create a list of data objects where state === us_state
            raw_data_us_state = []
            for item in data:
                if item.get('state') == us_state:
                    raw_data_us_state.append(item)

            # b. Process the data for the *current* us_state
            processed_data = process_us_state(raw_data_us_state, measurement)

            # c. Assign the data to *current* us_state "key" in dictionary
            data_structure[us_state] = processed_data

        return data_structure

    # Cases and Deaths are constants for the measurement input into ^
    CASES = 'cases'
    DEATHS = 'deaths'

    input_data = json.loads(json_data)
    cases_dict_for_s3 = create_daily_data_structure_for_ui(input_data, CASES)
    deaths_dict_for_s3 = create_daily_data_structure_for_ui(input_data, DEATHS)

    cases_data_for_s3 = json.dumps(cases_dict_for_s3)
    deaths_data_for_s3 = json.dumps(deaths_dict_for_s3)

    s3_hook = S3Hook(aws_conn_id="s3_connection")
    s3_hook.load_string(
        string_data=cases_data_for_s3,
        key="daily_cases.json",
        bucket_name="c19-airflow-2020",
        replace=True
    )

    s3_hook.load_string(
        string_data=deaths_data_for_s3,
        key="daily_deaths.json",
        bucket_name="c19-airflow-2020",
        replace=True
    )


nyt_data = PythonOperator(
    task_id="nyt_data",
    python_callable=process_nyt_data,
    dag=dag,
)


def cases_7day_task():
    def cases_7day_moving_average():
        # Load in the json data
        URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/nyt-daily_cases.json"
        r = requests.get(url=URL)
        data = r.text
        dict_data = json.loads(data)

        # Create a Data structure to return
        data_structure = {}

        for us_state in state_names:

            # loop through the list and find the moving average for day i
            current = dict_data[us_state]
            current_state_7day = []

            # if day is between 0 and 6, then I need to divide by less than 7 days
            for i in range(len(current)):
                data_point = {}
                mean = 0
                sum = 0
                if i == 0:
                    sum = current[i]['y']
                    mean = sum
                elif i < 6:
                    # do something
                    for x in range(0, i):
                        sum = sum + current[x]['y']
                    mean = sum / i+1
                else:
                    for x in range(i - 6, i+1):
                        sum = sum + current[x]['y']
                    mean = sum / 7

                data_point['x'] = current[i]['x']
                data_point['y'] = round(mean)

                current_state_7day.append(data_point)

            data_structure[us_state] = current_state_7day

        return data_structure

    cases_dict = cases_7day_moving_average()
    cases_json_s3 = json.dumps(cases_dict)

    s3_hook = S3Hook(aws_conn_id="s3_connection")
    s3_hook.load_string(
        string_data=cases_json_s3,
        key="daily_cases_moving_average.json",
        bucket_name="c19-airflow-2020",
        replace=True
    )


cases_7day = PythonOperator(
    task_id="cases_7day",
    python_callable=cases_7day_task,
    dag=dag
)


def deaths_7day_task():
    def deaths_7day_moving_average():
        # Load in the json data
        URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/daily_deaths.json"
        r = requests.get(url=URL)
        data = r.text
        dict_data = json.loads(data)

        # Create a Data structure to return
        data_structure = {}

        # for each item in json data
        for us_state in state_names:

            # loop through the list and find the moving average for day i
            current = dict_data[us_state]
            current_state_7day = []

            # if is is between 0 and 6, then I need to divide by less than 7 days
            for i in range(len(current)):
                data_point = {}
                mean = 0
                sum = 0
                if i == 0:
                    sum = current[i]['y']
                    mean = sum
                elif i < 6:
                    # do something
                    for x in range(0, i):
                        sum = sum + current[x]['y']
                    mean = sum / i+1
                else:
                    for x in range(i - 6, i+1):
                        sum = sum + current[x]['y']
                    mean = sum / 7

                data_point['x'] = current[i]['x']
                data_point['y'] = round(mean)

                current_state_7day.append(data_point)

            data_structure[us_state] = current_state_7day

        return data_structure

    deaths_dict = deaths_7day_moving_average()
    deaths_json_s3 = json.dumps(deaths_dict)

    s3_hook = S3Hook(aws_conn_id="s3_connection")
    s3_hook.load_string(
        string_data=deaths_json_s3,
        key="daily_deaths_moving_average.json",
        bucket_name="c19-airflow-2020",
        replace=True
    )


deaths_7day = PythonOperator(
    task_id="deaths_7day",
    python_callable=deaths_7day_task,
    dag=dag
)


def process_rt_data():

    def get_rt_data():
        RT_LINK = "https://d14wlfuexuxgcm.cloudfront.net/covid/rt.csv"
        df = pd.read_csv(RT_LINK)
        df_trim = df[['date', 'region', 'mean', 'lower_80', 'upper_80']]
        df_trim = df_trim[df_trim.region != 'DC']
        num_null_values = df_trim.isnull().sum()
        df_trim = df_trim.rename({'region': 'state'}, axis=1)
        df_trim = df_trim.replace({'state': state_name_map})
        df_trim = df_trim.round(2)

        json_data = df_trim.reset_index().to_json(orient="records")

        return json_data

    # state_data is an array of objects
    def process_us_state_rt(state_data):
        return_me = []
        for i in range(len(state_data)):
            data_point = {}
            data_point['x'] = state_data[i]['date']
            data_point['y'] = state_data[i]['mean']
            return_me.append(data_point)
        return return_me

    def create_rt_ui_data_structure(rt_data):

        # Create a Data Structure Object to be returned at the end
        data_structure = {}

        # Loop through each state,
        #    Apply data transformation
        #    And assign data to DS object

        for us_state in state_names:
            # For the current US State
            # 1. Create a list of data objects where state === us_state
            print(rt_data[0].keys())
            raw_data_us_state = []
            for item in rt_data:
                if item.get('state') == us_state:
                    raw_data_us_state.append(item)

            # 2. Call the process_us_state_rt
            processed_data = process_us_state_rt(raw_data_us_state)

            # 3. Assign the data to current US State "key"
            #  in the data structure
            data_structure[us_state] = processed_data

        return data_structure

    rt_data = get_rt_data()
    rt_data = json.loads(rt_data)

    output_data = create_rt_ui_data_structure(rt_data)
    upload = json.dumps(output_data)

    s3_hook = S3Hook(aws_conn_id="s3_connection")
    s3_hook.load_string(
        string_data=upload,
        key="reproduction_rate.json",
        bucket_name="c19-airflow-2020",
        replace=True,
    )


rt_data = PythonOperator(
    task_id="rt_data",
    python_callable=process_rt_data,
    dag=dag,
)


def contact_trace_rate():
    def calc_contact_trace_rate():
        # 1. Fetch the remote resource for the contact trace rate
        TEST_AND_TRACE_URL = "https://c19-airflow-s3.s3.us-east-2.amazonaws.com/testandtrace.csv"
        df = pd.read_csv(TEST_AND_TRACE_URL)
        df = df.iloc[:, 0:5]

        df = df[df.State != 'District of Columbia']
        df = df.rename({'# of Contact Tracers': 'contact_tracers'}, axis=1)

        # 2. Convert this remote resource to json
        json_data = df.reset_index().to_json(orient="records")

        contact_trace_data = json.loads(json_data)

        # I need to create a dictionary of state->tracers
        state_tracers_dict = {}

        for item in contact_trace_data:
            current_state = item['State']
            state_tracers_dict[current_state] = item['contact_tracers']

        # 3. Fetch the daily case moving average data from s3
        S3_BUCKET_URL = "https://c19-airflow-s3.s3.us-east-2.amazonaws.com/nyt-7day-cases.json"
        r = requests.get(S3_BUCKET_URL)
        data = r.text

        data_dict = json.loads(data)

        us_states = list(data_dict.keys())

        data_structure = {}
        for us_state in us_states:
            list_of_calculations = []
            current_state_data = data_dict[us_state]
            iterator = next(
                item for item in contact_trace_data if item["State"] == us_state)
            print('THIS IS THE ITERATOR', iterator)
            contact_tracers = iterator['contact_tracers']
            tracing_capacity = contact_tracers/5

            for day in current_state_data:

                data_point = {}

                data_point['x'] = day['x']

                # contact trace rate = number of cases on day i / number of contact tracers/5
                if day['y'] == 0:
                    ctr = 1
                else:
                    ctr = tracing_capacity / day['y']

                if ctr > 1:
                    ctr = 1

                day_contact_trace_rate = round(ctr, 2)

                data_point['y'] = day_contact_trace_rate

                list_of_calculations.append(data_point)

            data_structure[us_state] = list_of_calculations

        return data_structure

    output = calc_contact_trace_rate()

    s3_contact_trace_rate = json.dumps(output)
    s3_hook = S3Hook(aws_conn_id="s3_connection")
    s3_hook.load_string(
        string_data=s3_contact_trace_rate,
        key="contact_trace_rate-test.json",
        bucket_name="c19-airflow-s3",
        replace=True
    )


contact_trace_rate = PythonOperator(
    task_id="contact_trace_rate",
    python_callable=contact_trace_rate,
    dag=dag,
)

create_s3_bucket >> nyt_data
create_s3_bucket >> rt_data
nyt_data >> cases_7day >> contact_trace_rate
nyt_data >> deaths_7day
