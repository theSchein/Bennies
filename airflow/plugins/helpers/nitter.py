# nitter.py
from ntscraper import Nitter

# def initialize_scraper(instances="http://localhost:8090/", log_level=1, skip_instance_check=False):
def initialize_scraper(instances=None, log_level=1, skip_instance_check=False):
    return Nitter(instances=instances, log_level=log_level, skip_instance_check=skip_instance_check)
