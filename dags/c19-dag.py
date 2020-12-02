import json
import requests
import pandas as pd
import boto3
import time

from botocore.client import BaseClient
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
    'retry_delay': timedelta(minutes=1),
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
        replace=True,
        acl_policy='public-read'
    )

    s3_hook.load_string(
        string_data=deaths_data_for_s3,
        key="daily_deaths.json",
        bucket_name="c19-airflow-2020",
        replace=True,
        acl_policy='public-read'
    )


nyt_data = PythonOperator(
    task_id="nyt_data",
    python_callable=process_nyt_data,
    dag=dag,
)


def cases_7day_task():
    def cases_7day_moving_average():
        # Load in the json data
        URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/daily_cases.json"
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
        replace=True,
        acl_policy='public-read'
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
        replace=True,
        acl_policy="public-read"
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
        acl_policy="public-read"
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
        S3_BUCKET_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/daily_cases_moving_average.json"
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
        key="contact_trace_rate.json",
        bucket_name="c19-airflow-2020",
        replace=True,
        acl_policy="public-read"
    )


contact_trace_rate = PythonOperator(
    task_id="contact_trace_rate",
    python_callable=contact_trace_rate,
    dag=dag,
)


def positive_test_rate_task():
    def calc_daily_negative_tests():
        URL = "https://api.covidtracking.com/v1/states/daily.csv"
        df = pd.read_csv(URL)

        df = df.iloc[:, 0:5]

        df = df[df.state != 'AS']
        df = df[df.state != 'DC']
        df = df[df.state != 'GU']
        df = df[df.state != 'MP']
        df = df[df.state != 'PR']
        df = df[df.state != 'VI']

        df = df.fillna(0)

        json_data = df.reset_index().to_json(orient="records")
        data = json.loads(json_data)

        # Fix the item['state']
        for data_point in data:
            data_point['state'] = state_name_map[data_point['state']]

        return_dict = {}

        for us_state in state_names:
            state_append = []
            current_state = []
            for value in data:
                if value['state'] == us_state:
                    current_state.append(value)

            # Sort the data by date
            current_state.reverse()

            # Calculate the daily negative tests
            for i in range(len(current_state)):
                data_point = {}

                date = str(current_state[i]['date'])
                year = date[:4]
                month = date[4:6]
                day = date[6:]
                formatted_date = year + "-" + month + "-" + day
                data_point['x'] = formatted_date

                if i == 0:
                    data_point['y'] = current_state[i]['negative']
                else:
                    today = current_state[i]['negative']
                    yesterday = current_state[i-1]['negative']
                    data_point['y'] = today - yesterday

                state_append.append(data_point)

            return_dict[us_state] = state_append

        return return_dict

    def calc_7day_negative_tests(daily_negatives):
        # Make a list of the state names
        us_states = list(daily_negatives.keys())

        # Create a Data structure to return
        data_structure = {}

        # for each item in json data
        for us_state in us_states:

            # loop through the list and find the moving average for day i
            current = daily_negatives[us_state]
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

    def calc_positive_test_rate(daily_cases, daily_negatives):
        # How am I going to do this?

        # Create a data structure to return
        data_structure = {}

        # Get a list of us_states
        us_states = list(daily_negatives.keys())

        # for each state:
        for us_state in us_states:

            # create a list of calc_state
            calc_state = []

            current_negatives_list = daily_negatives[us_state]
            current_cases_list = daily_cases[us_state]

            # for each current_state_list:
            for element in current_negatives_list:

                # create a datapoint
                data_point = {}

                # identify the date
                date = element['x']

                # set the x-value to the date
                data_point['x'] = date

                # find the item in the daily_cases list
                iterator = next((
                    item for item in current_cases_list if item["x"] == date), None)

                if iterator == None:
                    continue

                cases = iterator['y']
                # perform the calculation

                # cases =

                # negatives =

                negatives = element['y']

                # total = cases + negatives
                total = cases + negatives

                # rate = cases / total
                if total == 0:
                    continue
                else:
                    rate = round(cases/total, 3)

                if rate > 1:
                    print('==========================')
                    print('STATE', us_state)
                    print('DATE', date)
                    print('==========================')
                    print('CASES', cases)
                    print('NEGATIVES', negatives)
                    print('TOTAL', total)
                    print('==========================')
                    continue
                # set the y-value to be the rate
                data_point['y'] = rate

                # append the data_point to the calc_state list
                calc_state.append(data_point)

            data_structure[us_state] = calc_state

        return data_structure

    # get the 7 day cases from s3
    DAILY_CASES_MA_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/daily_cases_moving_average.json"
    r = requests.get(DAILY_CASES_MA_URL)
    daily_cases_7day = json.loads(r.text)
    print(daily_cases_7day.keys())
    daily_negative_tests = calc_daily_negative_tests()

    negative_tests_7day = calc_7day_negative_tests(daily_negative_tests)

    positive_test_rate_data = calc_positive_test_rate(
        daily_cases_7day, negative_tests_7day)

    positive_test_rate_s3 = json.dumps(positive_test_rate_data)

    s3_hook = S3Hook(aws_conn_id="s3_connection")
    s3_hook.load_string(
        string_data=positive_test_rate_s3,
        key="positive_test_rate.json",
        bucket_name="c19-airflow-2020",
        replace=True,
        acl_policy="public-read"
    )
    print('this is the positive test rate task')


positive_test_rate = PythonOperator(
    task_id="positive_test_rate",
    python_callable=positive_test_rate_task,
    dag=dag
)


def summary_task():
    # How should I think of the summary?

    def fetch_data():
        # fetch reproduction_rate
        RR_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/reproduction_rate.json"
        r_rr = requests.get(url=RR_URL)
        rr = json.loads(r_rr.text)

        # fetch positive_test_rate
        PTR_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/positive_test_rate.json"
        r_ptr = requests.get(url=PTR_URL)
        ptr = json.loads(r_ptr.text)

        # fetch contact_trace_rate
        CTR_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/contact_trace_rate.json"
        r_ctr = requests.get(url=CTR_URL)
        ctr = json.loads(r_ctr.text)

        return rr, ptr, ctr

    def calc_risk_level(rr, ptr, ctr):
        if rr > 1.2:
            return 'critical'
        elif rr > 1.1:
            return 'high'
        elif rr > 1.0:
            return 'medium'
        else:
            return 'low'

    def calc_summary(rr, ptr, ctr):
        # What needs to be included in the summary?
        # summary = { state: { summary dictionary }}
        summary = {}

        for us_state in list(rr.keys()):
            # summary dictionary = { rr, ptr, ctr, date }
            state_summary = {}

            current_rr = rr[us_state][-1]['y']
            current_ptr = ptr[us_state][-1]['y']
            current_ctr = ctr[us_state][-1]['y']
            current_risk_level = calc_risk_level(
                current_rr, current_ptr, current_ctr)

            state_summary['reproduction_rate'] = current_rr
            state_summary['positive_test_rate'] = current_ptr
            state_summary['contact_trace_rate'] = current_ctr
            state_summary['risk_level'] = current_risk_level

            summary[us_state] = state_summary

        return summary

    rr, ptr, ctr = fetch_data()

    summary = calc_summary(rr, ptr, ctr)

    summary_data_for_s3 = json.dumps(summary)

    # I now have the summary I need to just prepare it for s3
    s3_hook = S3Hook(aws_conn_id="s3_connection")
    s3_hook.load_string(
        string_data=summary_data_for_s3,
        key="summary.json",
        bucket_name="c19-airflow-2020",
        replace=True,
        acl_policy="public-read"
    )


summary = PythonOperator(
    task_id="summary",
    python_callable=summary_task,
    dag=dag,
)


def join_all_data_task():
    print('This will be the last step where I join all data')

    POSITIVE_TEST_RATE_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/positive_test_rate.json"
    REPRODUCTION_RATE_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/reproduction_rate.json"
    CONTACT_TRACE_RATE_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/contact_trace_rate.json"
    DAILY_CASES_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/nyt-daily_cases.json"
    DAILY_CASES_MA_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/daily_cases_moving_average.json"
    DAILY_DEATHS_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/daily_deaths.json"
    DAILY_DEATHS_MA_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/daily_deaths_moving_average.json"
    SUMMARY_URL = "https://c19-airflow-2020.s3.us-east-2.amazonaws.com/summary.json"

    ptr_response = requests.get(url=POSITIVE_TEST_RATE_URL)
    ptr_dict = json.loads(ptr_response.text)

    rr_response = requests.get(url=REPRODUCTION_RATE_URL)
    rr_dict = json.loads(rr_response.text)

    ctr_response = requests.get(url=CONTACT_TRACE_RATE_URL)
    ctr_dict = json.loads(ctr_response.text)

    dc_response = requests.get(url=DAILY_CASES_URL)
    dc_dict = json.loads(dc_response.text)

    dcma_response = requests.get(url=DAILY_CASES_MA_URL)
    dcma_dict = json.loads(dcma_response.text)

    dd_response = requests.get(url=DAILY_DEATHS_URL)
    dd_dict = json.loads(dd_response.text)

    ddma_response = requests.get(url=DAILY_DEATHS_MA_URL)
    ddma_dict = json.loads(ddma_response.text)

    summary_response = requests.get(url=SUMMARY_URL)
    summary_dict = json.loads(summary_response.text)

    # Load in all of the data from s3 buckets

    # { state: { ptr:[], rt:[], ctr:[], dc:[], dd:[] } }
    data_structure = {}

    for us_state in state_names:

        # This will eventually have keys ptr, rt, ctr, ...
        state_dict = {}

        # Positive Test Rate
        state_positive_test_rate = ptr_dict[us_state]
        state_dict['positive_test_rate'] = state_positive_test_rate

        # Reproduction Rate
        state_reproduction_rate = rr_dict[us_state]
        state_dict['reproduction_rate'] = state_reproduction_rate

        # Contact Trace Rate
        state_contact_trace_rate = ctr_dict[us_state]
        state_dict['contact_trace_rate'] = state_contact_trace_rate

        # Daily Cases
        state_daily_cases = dc_dict[us_state]
        state_dict['daily_cases'] = state_daily_cases

        # Daily Cases (Moving Average)
        state_daily_cases_moving_average = dcma_dict[us_state]
        state_dict['daily_cases_moving_average'] = state_daily_cases_moving_average

        # Daily Deaths
        state_daily_deaths = dd_dict[us_state]
        state_dict['daily_deaths'] = state_daily_deaths

        # Daily Deaths (Moving Average)
        state_daily_deaths_moving_average = ddma_dict[us_state]
        state_dict['daily_deaths_moving_average'] = state_daily_deaths_moving_average

        # Summary
        state_summary = summary_dict[us_state]
        state_dict['summary'] = state_summary

        data_structure[us_state] = state_dict

    join_s3 = json.dumps(data_structure)
    s3_hook = S3Hook(aws_conn_id="s3_connection")
    s3_hook.load_string(
        string_data=join_s3,
        key="join.json",
        bucket_name="c19-airflow-s3",
        replace=True,
        acl_policy="public-read"
    )


join_all_data = PythonOperator(
    task_id="join_all_data",
    python_callable=join_all_data_task,
    dag=dag,
)


create_s3_bucket >> nyt_data
create_s3_bucket >> rt_data
nyt_data >> cases_7day >> contact_trace_rate >> positive_test_rate >> summary >> join_all_data
nyt_data >> deaths_7day
