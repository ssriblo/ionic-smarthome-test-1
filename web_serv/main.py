import datetime
from flask import Flask, render_template, request
from flask_cors import CORS
import requests
import json
from tokenJwt import Token
import configparser
from push_onesignal import  Post2onesignal
import atexit
from apscheduler.schedulers.background import BackgroundScheduler
import os    
import time
import logging
from weather_temp import Weather
from temperatures_local_db import TempValLocal

Push = Post2onesignal()
#Push.push("Пуш нотификация","Тревога") # for test only
TV = TempValLocal()
WT = Weather()
token = Token()
__server_status = 0
__pushN = 0

logging.basicConfig(filename='./web-serv.log', filemode='a', format='%(levelname)s - %(asctime)s - %(message)s', level=logging.WARN)

config = configparser.ConfigParser()                           
config.read('./config.ini')
log = config.get('MODE', 'LOGLEVEL')

app = Flask(__name__)
CORS(app)

location = config.get('MODE', 'LOCATION')
print ("[TokenJwt] location", location)
if location == "cloud":
    import ssl 
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER) 
    context.load_cert_chain(
        '/etc/letsencrypt/live/otoplenok.ru/fullchain.pem', 
        '/etc/letsencrypt/live/otoplenok.ru/privkey.pem'
        )

def checkAlert(): 
    global __server_status
    global __pushN
    prompts = [
        "Тестовое сообщение",
        "Нет электропитания",
        "Протечка в квартире",
        "Протечка на этаже",
        "",                
        "",                
        "",                
        "",                
        ]
#    ticks = time.time()
#    print ("Number of ticks since 12:00am, January 1, 1970:", ticks)
    ss = int(TV.serversStatus)
    if ( ( ss != __server_status ) and (ss != 0) ):
        if ( (ss >= 1) and (ss <= 8) ):
            prompt = prompts[ss]
            Push.push("ОТОПЛЕНОК", "Пуш нотификация", prompt + " " + str(__pushN))
            logging.warning(f'PUSH: ss={ss} __pushN={__pushN}')
            __pushN = __pushN + 1
    __server_status = ss

# https://www.programcreek.com/python/example/94838/apscheduler.schedulers.background.BackgroundScheduler 
# Example 1
scheduler = BackgroundScheduler()
scheduler.add_job(checkAlert, 'interval', seconds=60)
scheduler.start()

###############################################################################
# API GET:
# temperatureWeather/
# temperatureRoom/
# temperatureWater/
# /temperatureComfort
# /temperatureEconom
# /targetTemperature
# serversStatus

# API POST:
# updateTargetTemperature
# updateComfortTemperature
# updateEconomTemperature

###############################################################################
@app.route('/temperatureWeather', methods=['GET']) 
def temperatureWeather():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[temperatureWeather] _tk : ", _tk)
    weather_temp = "%.1f" % (WT.request_current_weather(520555,) ) # 520555 - Nizhniy Novgorod
    value = weather_temp if (_tk != None) else None
    print("[temperature_weather] NN value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/temperatureRoom', methods=['GET']) 
def temperatureRoom():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[temperatureRoom] _tk : ", _tk)
    value = TV.roomT if (_tk != None) else None
    print("[temperatureRoom] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/temperatureWater', methods=['GET']) 
def temperatureWater():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[temperatureWater] _tk : ", _tk)
    value = TV.waterT if (_tk != None) else None
    print("[temperatureWater] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/temperatureComfort', methods=['GET']) 
def temperatureComfort():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[temperatureComfort] _tk : ", _tk)
    value = TV.comfortT if (_tk != None) else None
    print("[temperatureComfort] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/temperatureEconom', methods=['GET']) 
def temperatureEconom():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[temperatureEconom] _tk : ", _tk)
    value = TV.economT if (_tk != None) else None
    print("[temperatureEconom] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/targetTemperature', methods=['GET']) 
def targetTemperature():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[targetTemperature] _tk : ", _tk)
    value = TV.targetT if (_tk != None) else None
    print("[targetTemperature] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/serversStatus', methods=['GET']) 
def serversStatus():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[serversStatus] _tk : ", _tk)
    value = TV.serversStatus if (_tk != None) else None
    print("[serversStatus] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/updateTargetTemperature', methods=['POST']) 
def updateTargetTemperature():
    body = request.json
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[update_target_temperature] _tk : ", _tk)
    if (_tk != None):
        TV.targetT = body['value']
        print("[update_target_temperature] RETURN OK  body.value: ", body,  body['value'])
    return {'value': str(TV.targetT)}

###############################################################################
@app.route('/updateComfortTemperature', methods=['POST']) 
def updateComfortTemperature():
    body = request.json
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[updateComfortTemperature] _tk : ", _tk)
    if (_tk != None):
        TV.comfortT = body['value']
        print("[updateComfortTemperature] RETURN OK  body.value: ", body,  body['value'])
    return {'value': str(TV.comfortT)}

###############################################################################
@app.route('/updateEconomTemperature', methods=['POST']) 
def updateEconomTemperature():
    body = request.json
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[updateEconomTemperature] _tk : ", _tk)
    if (_tk != None):
        TV.economT = body['value']
        print("[updateEconomTemperature] RETURN OK  body.value: ", body,  body['value'])
    return {'value': str(TV.economT)}

###############################################################################

# curl -i -H "Content-Type: application/json" -X POST -d '{"userId":"1", "username": "fizz bizz"}' http://127.0.0.1:8080/foo?jwt=123
# TESTED !!
@app.route('/foo', methods=['POST']) 
def foo():
    j = request.json
    print ("JSON: ", j)
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    return json.dumps(j) + jwt
###############################################################################



if __name__ == '__main__':
    try:
        if location == "cloud":
            app.run(host='0.0.0.0', port=8080, debug=False, ssl_context=context)
        else:
            app.run(port=8080, debug=False)
    except (KeyboardInterrupt, SystemExit):
        # Not strictly necessary if daemonic mode is enabled but should be done if possible
        scheduler.shutdown() 


