import json
import datetime
from flask import Flask, render_template, request
#from flask_cors import CORS
import requests


class Weather():
    appid = None
    def __init__(self):
        with open('/home/me/Working/Angular/Angular_20h_course/private_keys_store_dont_delete/openweathermap.json') as f:
            data = json.load(f)
        self.appid = data["key"]
#        print(data, self.appid)

    # Запрос текущей погоды
    def request_current_weather(self, city_id):
        try:
            res = requests.get("http://api.openweathermap.org/data/2.5/weather",
                params={'id': city_id, 'units': 'metric', 'lang': 'ru', 'APPID': self.appid})
            data = res.json()
    #        print("conditions:", data['weather'][0]['description'])
    #        print("temp:", data['main']['temp'])
    #        print("temp_min:", data['main']['temp_min'])
    #        print("temp_max:", data['main']['temp_max'])
    #        print("data:", data)
        except Exception as e:
            print("Exception (weather):", e)
            pass
        return data['main']['temp']

