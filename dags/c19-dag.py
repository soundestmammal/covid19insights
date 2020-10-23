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

create_s3_bucket >> nyt_data
