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
import json
from datetime import datetime
from logging.handlers import RotatingFileHandler
import sys

app = Flask(__name__)
CORS(app)

#######################################################
# if opt argument == None - normal mode. If opt argument is number - test mode, opt==fs
def checkAlert(opt): 
    global __flags_status
    global __pushN

    prompts = [
        ["Авария электропитания", "warning", "Электропитание в норме", "success"],
        ["Протечка",  "danger", "Протечка устранена", "success"],
        ["Датчик воздуха недоступен", "tertiary",  "Датчик воздуха норм.", "success"],
        ["Датчик воды недоступен", "tertiary", "Датчик воды норм.", "success"],
        [],
        [],
        [],
        [],  ]
    # print(prompts[0][0])        
    # print(prompts[0][1])        
    # print(prompts[1][0])        
    # print(prompts[1][1])        
    # print(prompts[2][0])        
    # print(prompts[2][1])        
    # print(prompts[3][0])        
    # print(prompts[3][1])        
#    ticks = time.time()
#    print ("Number of ticks since 12:00am, January 1, 1970:", ticks)
    # FLAGs1 byte format:
    # SW1 SW2 SW3 spare DI4 DI3 DI2 POWER(1-failed)
    if (opt == None):
        fs = int(TV.flags1)
    else:
        fs = opt
#    logging.warning(f'PUSH: fs={fs} __flags_status={__flags_status}')
    fs_shifted = fs >> 4 # shift right SW1/SW2/SW3
    fs_shifted = fs_shifted | ( fs & 0x1) 
    diff = fs_shifted ^ __flags_status
    print(f"[checkAlert] argument={opt} fs_shifted={fs_shifted} __flags_status={__flags_status}")
    prompt = ""
    color_alert = "danger"
    if ( diff != 0 ):
        # fs_shifted byte format:
        # X X X X WATER_SENSOR_FAIL AIR_SENSOR_FAIL PROTECHKA POWER_FAIL
        for i in range(0,4):
            if ( (diff >> i) & 1 ):
                if ( (fs_shifted >> i) & 1 ):
                    prompt = prompts[i][0] # Fault=1
                    color_alert = prompts[i][1]
                    __flags_status = __flags_status | (1<<i)
                    break
                else:
                    prompt = prompts[i][2] # Fault=0
                    color_alert = prompts[i][3]
                    __flags_status = __flags_status & ~(1<<i)
                    break
        if (opt != None):
            print(f"after:  __flags_status={__flags_status}")
            print(f"PROMPT={prompt} color_alert={color_alert}\n")
            return
        else:
            #  def push(self, heading, cont_msg, alert_msg):
            # NOTE: last argument "OK" - for button at alert splash temporary, V31 build. Later it will not mater
            Push.push("ОТОПЛЕНОК", prompt, color_alert) 
            logging.warning(f'PUSH: fs={fs} PUSH notification={prompt} __pushN={__pushN}')
            __pushN = __pushN + 1


def weatherUpdate():
    weather_temp = "%.1f" % (WT.request_current_weather(520555,) ) # 520555 - Nizhniy Novgorod
    TV.weatherT = weather_temp
    print(f"Weather Update={TV.weatherT}")


# https://www.programcreek.com/python/example/94838/apscheduler.schedulers.background.BackgroundScheduler 
# Example 1
scheduler = BackgroundScheduler()
scheduler.add_job(checkAlert, 'interval', [None], seconds=10) # for debugging 10s; [None] - means that ordinary call, not unit test
scheduler.add_job(weatherUpdate, 'interval', seconds=60)
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
#    weather_temp = "%.1f" % (WT.request_current_weather(520555,) ) # 520555 - Nizhniy Novgorod
    value = TV.weatherT if (_tk != None) else None
#    value = weather_temp if (_tk != None) else None
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
@app.route('/electroMeterT1', methods=['GET']) 
def electroMeterT1():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[serversStatus] _tk : ", _tk)
    value = TV.electroMeterT1 if (_tk != None) else None
    print("[electroMeterT1] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/electroMeterT2', methods=['GET']) 
def electroMeterT2():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[serversStatus] _tk : ", _tk)
    value = TV.electroMeterT2 if (_tk != None) else None
    print("[electroMeterT2] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/warmMeter', methods=['GET']) 
def warmMeter():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[serversStatus] _tk : ", _tk)
    value = TV.warmMeter if (_tk != None) else None
    print("[warmMeter] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/waterColdMeter', methods=['GET']) 
def waterColdMeter():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[serversStatus] _tk : ", _tk)
    value = TV.waterColdMeter if (_tk != None) else None
    print("[waterColdMeter] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/waterHotMeter', methods=['GET']) 
def waterHotMeter():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[serversStatus] _tk : ", _tk)
    value = TV.waterHotMeter if (_tk != None) else None
    print("[waterHotMeter] value:  ", value)
    return {"value": value}

###############################################################################
@app.route('/keepAliveReceive', methods=['GET']) 
def keepAliveReceive():
    global keepAliveToken
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[serversStatus] _tk : ", _tk)
    valOPCUA = TV.keepAliveOPCUA if (_tk != None) else None
    valPLC = TV.keepAlivePLC if (_tk != None) else None
    value = {"plc":valPLC, "opcua":valOPCUA, "api":keepAliveToken}
    print("[keepAliveReceive] value:  ", value)
    return value

###############################################################################
@app.route('/faultStatus', methods=['GET']) 
def faultStatus():
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[serversStatus] _tk : ", _tk)
    value = TV.flags1 if (_tk != None) else None
    print("[faultStatus] value:  ", value)
    return {"value": value}
    
###############################################################################
###############################################################################
###############################################################################
@app.route('/keepAliveSendToken', methods=['POST']) 
def keepAliveSendToken():
    global keepAliveToken
    body = request.json
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[keepAliveSendToken] _tk : ", _tk)
    if (_tk != None):
        TV.keepAliveToken = body['token']
        keepAliveToken = body['token']
        print("[keepAliveSendToken] body===", body, body['token'])
        logging.warning(f'keepAliveSendToken] body={body}')
    return {'value': str(TV.targetT)}

###############################################################################
@app.route('/updateTimeTable', methods=['POST']) 
def updateTimeTable():
    body = request.json
    jwt = request.args.get('jwt')
#    print("JWT: ", jwt)
    _tk = token.getToken(jwt)
#    print("[updateTimeTable] _tk : ", _tk)
    if (_tk != None):
        # Let convert json body to string:
        s = json.dumps(body) 
#        TV.timetable = body # это первоначальная реализация, на которой была проблема с sqlitedict
        TV.timetable = s 
        print("[updateTimeTable] body===", body)
        logging.warning(f'updateTimeTable] body={body}')
    return {'value': str(TV.targetT)}

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
        print("[update_target_temperature] TIMETABLE: ", TV.timetable)
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
    print ('Number of arguments:', len(sys.argv), 'arguments.')
    print ('Argument List:', str(sys.argv))
    test = False
    if(len(sys.argv) == 2 ):    # For Test Only
        test = True
        
    Push = Post2onesignal()
    #Push.push("Пуш нотификация","Тревога") # for test only
    TV = TempValLocal()
    WT = Weather()
    token = Token()
    dateTimeObj = datetime.now()
    keepAliveToken = None

    __flags_status = 0
    __pushN = 0

    #logging.basicConfig(filename='./web-serv.log', filemode='a', format='%(levelname)s - %(asctime)s - %(message)s', level=logging.WARN)
    log_formatter = logging.Formatter('%(asctime)s %(levelname)s (%(lineno)d) %(message)s')
    logFile = './web-serv.log'
    my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=5*1024*1024, 
                                    backupCount=2, encoding=None, delay=0)
    my_handler.setFormatter(log_formatter)
    my_handler.setLevel(logging.INFO)
    logging = logging.getLogger('root')
    #    logging.setLevel(logging.INFO) # does not work, but why??
    logging.addHandler(my_handler)


    config = configparser.ConfigParser()                           
    config.read('./config.ini')
    log = config.get('MODE', 'LOGLEVEL')

    location = config.get('MODE', 'LOCATION')

    print ("[TokenJwt] location", location)
    if (location == "cloud") and (test == False):
        import ssl 
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER) 
        context.load_cert_chain(
            '/etc/letsencrypt/live/otoplenok.ru/fullchain.pem', 
            '/etc/letsencrypt/live/otoplenok.ru/privkey.pem'
            )


    if(len(sys.argv) == 2 ):    # For Test Only
        test = True
        print("********** TEST for checkAlert() ************** ")
        # WATER_SENSOR_FAIL AIR_SENSOR_FAIL PROTECHKA spare DI4 DI3 DI2 POWER(1-failed)
        # X X X X WATER_SENSOR_FAIL AIR_SENSOR_FAIL PROTECHKA POWER_FAIL
        checkAlert(1)
        checkAlert(2**7 + 1)
        checkAlert(2**7 + 2**5 + 1)
        checkAlert(2**7 + 2**5 + 1)
        checkAlert(2**7 + 2**5 + 1)
        checkAlert(2**7 +  1)
        checkAlert(2**7 + 2**5 )
        checkAlert(0)
        checkAlert(2**7 + 2**6 + 0)
        checkAlert(0)
        checkAlert(0)
        checkAlert(0)
        print("***********")
        checkAlert(2**7 + 2**6 + 2**5 + 1)
        checkAlert(2**7 + 2**6 + 2**5 + 1)
        checkAlert(2**7 + 2**6 + 2**5 + 1)
        checkAlert(2**7 + 2**6 + 2**5 + 1)
        checkAlert(2**7 + 2**6 + 2**5 + 1)
        print("***********")
        checkAlert(0)
        checkAlert(0)
        checkAlert(0)
        checkAlert(0)
        sys.exit(0)

    try:
        if location == "cloud":
            app.run(host='0.0.0.0', port=8080, debug=False, ssl_context=context)
        else:
            app.run(port=8080, debug=False)
    except (KeyboardInterrupt, SystemExit):
        # Not strictly necessary if daemonic mode is enabled but should be done if possible
        scheduler.shutdown() 


