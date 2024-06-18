#!/bin/bash

# Define variables
AIRFLOW_HOME=~/shuk/airflow
VENV_DIR=~/shuk/airflow/airflow_venv
PROJECT_DIR=~/shuk/airflow
PYTHON_VERSION=3.10

# Update and install dependencies
echo "Updating and installing dependencies..."
sudo apt-get install -y software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt-get update -y
sudo apt-get install -y python$PYTHON_VERSION python$PYTHON_VERSION-venv python$PYTHON_VERSION-dev libpq-dev

# Install pip for Python 3.10
echo "Installing pip for Python 3.10..."
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3.10 get-pip.py

# Create Python virtual environment
echo "Creating Python virtual environment..."
python$PYTHON_VERSION -m venv $VENV_DIR

# Activate virtual environment
source $VENV_DIR/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install Airflow and other dependencies
echo "Installing Airflow and other dependencies..."
AIRFLOW_VERSION=2.5.0
CONSTRAINT_URL="https://raw.githubusercontent.com/apache/airflow/constraints-2.5.0/constraints-3.10.txt"
pip install "apache-airflow==$AIRFLOW_VERSION" --constraint "$CONSTRAINT_URL"
pip install -r $PROJECT_DIR/requirements.txt
pip install python-dotenv

# Set up Airflow home and configuration
echo "Setting up Airflow home and configuration..."
export AIRFLOW_HOME=$AIRFLOW_HOME
mkdir -p $AIRFLOW_HOME
cp $PROJECT_DIR/airflow.cfg $AIRFLOW_HOME/airflow.cfg

# Modify airflow.cfg to bind to all network interfaces
sed -i 's/web_server_host = localhost/web_server_host = 0.0.0.0/' $AIRFLOW_HOME/airflow.cfg

# Initialize the Airflow database
echo "Initializing the Airflow database..."
yes | airflow db init

# Set up Airflow user (admin)
echo "Creating Airflow admin user..."
airflow users create \
    --username admin \
    --firstname Benny \
    --lastname Scheinberg \
    --role Admin \
    --email ben@bennies.fun \
    --password twins-sleep-bobsled

# Open the port on the firewall (optional, depends on your setup)
echo "Opening port 8080 on the firewall..."
sudo ufw allow 8080/tcp

# Start Airflow web server and scheduler
echo "Starting Airflow web server and scheduler..."
airflow webserver -p 8080 -D &  # Start the web server in the background
sleep 10  # Wait for the web server to start
airflow scheduler -D &  # Start the scheduler in the background

echo "Airflow setup is complete. Access the web UI at http://<your_server_ip>:8080"
