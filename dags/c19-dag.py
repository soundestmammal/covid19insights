import json
import requests
import pandas as pd

from datetime import datetime, timedelta

from airflow import DAG
from airflow.hooks.S3_hook import S3Hook
from airflow.operators.python_operator import PythonOperator

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
