pkill -f "airflow scheduler"
pkill -f "airflow webserver"

airflow scheduler &
airflow webserver &

