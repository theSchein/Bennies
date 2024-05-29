import subprocess
import os

def backup():
    try:
        print("Starting database backup, please be patient...")
        # Path to your bash script
        script_path = os.path.abspath("actions/backup/db_backup.sh")

        # Ensure the script is executable
        if not os.access(script_path, os.X_OK):
            os.chmod(script_path, 0o755)

        # Change working directory to the script's directory
        script_dir = os.path.dirname(script_path)
        os.chdir(script_dir)

        # Load environment variables from .env.local
        env_path = os.path.join(script_dir, "../../../.env.local")
        if os.path.isfile(env_path):
            env_vars = {}
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and "=" in line:
                        key, value = line.split("=", 1)
                        value = value.strip('"').strip("'")  # Remove surrounding quotes
                        env_vars[key] = value
                    else:
                        print(f"Skipping invalid line in .env.local: {line}")
        else:
            print(".env.local file not found!")
            return

        # Merge with current environment variables
        env = os.environ.copy()
        env.update(env_vars)

        # Execute the bash script
        result = subprocess.run(['bash', script_path], check=True, text=True, capture_output=True, env=env)

        # Check if the backup was successful
        if result.returncode == 0:
            print("Database backup successful!")
        else:
            print(f"Database backup failed: {result.stderr}")

    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
        print(f"Output: {e.output}")
        print(f"Error: {e.stderr}")

if __name__ == "__main__":
    backup()
