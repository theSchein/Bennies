#!/bin/bash

# Stop any existing Airflow scheduler and webserver
pkill -f "airflow scheduler"
pkill -f "airflow webserver"

# # Set the AIRFLOW_HOME environment variable
# export AIRFLOW_HOME=/root/shuk/airflow

# # Set environment variables to skip prompt for database migrations and load examples
# export AIRFLOW__CORE__LOAD_EXAMPLES=False
# export AIRFLOW__CORE__RUN_MIGRATION=True

# Initialize the Airflow database
# airflow db reset -y
yes | airflow db init
echo "Creating Airflow admin user..."
airflow users create \
    --username admin \
    --firstname Benny \
    --lastname Scheinberg \
    --role Admin \
    --email ben@bennies.fun \
    --password twins-sleep-bobsled


# Start Airflow scheduler and webserver
airflow webserver -p 8080 -D &

airflow scheduler -D &

# # Ensure Airflow logs are available
# mkdir -p $AIRFLOW_HOME/logs
# chmod -R 755 $AIRFLOW_HOME/logs

echo "Airflow scheduler and webserver started. Access the web UI at http://<your_server_ip>:8080"
