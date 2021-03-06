import os    
import configparser
import platform
import json
import datetime
from flask import Flask, render_template, request
#from flask_cors import CORS
import requests


class Weather():
    appid = None
    def __init__(self):
        config = configparser.ConfigParser()                                     
        config.read('./config.ini')
        location = config.get('MODE', 'LOCATION')
        print ("[weather_temp.Weather] location", location)
        if location == "local":
            __platform = platform.system()
            print("[weather_temp.Weather] platform", platform)
            if __platform == "Windows":
                credential_path = config.get('OPENWEATHERMAP_KEY_FILE', 'WINDOWS')
                credential_path = credential_path.strip('\"')
                print("[weather_temp.Weather] windows")
            elif __platform == "Linux":
                credential_path = config.get('OPENWEATHERMAP_KEY_FILE', 'LINUX')
            #    credential_path = credential_path.strip('\"') # ???QUESTION??? Did not check at Linux yet. BUT, it need for Windows !!!!!!!!!!!!!!!!!!!!!!!!!
                print("[weather_temp.Weather] linux")
        else:
                credential_path = config.get('OPENWEATHERMAP_KEY_FILE', 'LINUX')
                print("[weather_temp.Weather] linux-cloud")

#        with open('/home/me/Working/Angular/Angular_20h_course/private_keys_store_dont_delete/openweathermap.json') as f:
        with open(credential_path) as f:
            data = json.load(f)
        self.appid = data["key"]
#        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>1", data, self.appid)

    # Запрос текущей погоды
    def request_current_weather(self, city_id):
        try:
            res = requests.get("http://api.openweathermap.org/data/2.5/weather",
                params={'id': city_id, 'units': 'metric', 'lang': 'ru', 'APPID': self.appid})
            data = res.json()
    #        print("conditions:", data['weather'][0]['description'])
            print("[weather_temp.request_current_weather]:", data['main']['temp'])
    #        print("temp_min:", data['main']['temp_min'])
    #        print("temp_max:", data['main']['temp_max'])
    #        print("data:", data)
        except Exception as e:
            print("[weather_temp.request_current_weather] Exception :", e)
            pass
        return data['main']['temp']

