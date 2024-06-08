# dags/verify_metadata_dag.py
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
import sys
sys.path.append('/opt/airflow/scripts')
from scripts.verify.verify_metadata import verify_metadata

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
}

with DAG(
    'verify_metadata_dag',
    default_args=default_args,
    description='A DAG to verify metadata',
    schedule_interval=None,
    start_date=days_ago(2),
    tags=['example'],
) as dag:

    verify_task = PythonOperator(
        task_id='verify_metadata_task',
        python_callable=verify_metadata,
    )

    verify_task
