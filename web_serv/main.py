import datetime
from flask import Flask, render_template, request
from flask_cors import CORS
import requests
import json
from temperatures_firestore import TempVal 
from tokenJwt import Token
import configparser

TV = TempVal()
token = Token()
config = configparser.ConfigParser()                           
config.read('./config.ini')
log = config.get('MODE', 'LOGLEVEL')

app = Flask(__name__)
CORS(app)

import ssl 
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER) 
context.load_cert_chain(
    '/etc/letsencrypt/live/otoplenok.ru/fullchain.pem', 
    '/etc/letsencrypt/live/otoplenok.ru/privkey.pem'
    )

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
    value = TV.weatherT if (_tk != None) else None
    print("[temperature_weather] value:  ", value)
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
    value = TV.serverStatus if (_tk != None) else None
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
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
#    app.run(host='0.0.0.0', port=8080, debug=False, ssl_context=context)
    app.run( host='127.0.0.1' port=8080, debug=False, ssl_context=context)
#    app.run(port=8080, debug=False)

