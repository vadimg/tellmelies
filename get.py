from contextlib import contextmanager
import json

from selenium import webdriver


def save_data(url, filename):
    with webdriver.Chrome() as driver:
        driver.get(url)

        # wait until chart loads before getting the chartData
        driver.implicitly_wait(10) # seconds
        driver.find_element_by_css_selector('#chart_historical svg')

        data = driver.execute_script('return chartData;')

        with open(filename, 'w') as f:
            json.dump(data, f)


save_data('https://bluedollar.net/informal-rate/', 'blue.json')
save_data('https://bluedollar.net/official-rate/', 'official.json')
