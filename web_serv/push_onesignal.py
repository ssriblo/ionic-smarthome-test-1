import os    
import configparser
import platform
import json
import requests

class Post2onesignal():
    __api_key = ""
    __app_id = ""
    __url = ""

    def __init__(self):
        ones_api_key_file = None
        config = configparser.ConfigParser()                                     
        config.read('./config.ini')

        __platform = platform.system()
        print("[Post2onesignal] platform: ", __platform)
        if __platform == "Windows":
            print("[Post2onesignal] windows")
            ones_api_key_file = config.get('ONESIGNAL_API_KEY_FILE', 'WINDOWS')
            ones_api_key_file = ones_api_key_file.strip('\"')
            __url = config.get('ONESIGNAL_URL', 'WINDOWS')
            __app_id = config.get('ONESIGNAL_APP_ID', 'WINDOWS')
        elif __platform == "Linux":
            print("[Post2onesignal] linux")
            ones_api_key_file = config.get('ONESIGNAL_API_KEY_FILE', 'LINUX')
            self.__url = config.get('ONESIGNAL_URL', 'LINUX')
            self.__app_id = config.get('ONESIGNAL_APP_ID', 'LINUX')

        with open(ones_api_key_file) as f:
            data = json.load(f)
        self.__api_key = data["key"]
        self.__api_key = "Basic " + self.__api_key 



    def push(self, cont_msg, alert_msg):
        header = {"Content-Type": "application/json; charset=utf-8",
                "Authorization": self.__api_key}
        payload = {"app_id": self.__app_id,
                "included_segments": ["All"],
                "contents": {"en": cont_msg},
                "data": {"task": alert_msg},
                }       
        req = requests.post(self.__url, headers=header, data=json.dumps(payload))
        print(f'[Post2onesignal.push] req.status_code={req.status_code}  req.reason={req.reason}')