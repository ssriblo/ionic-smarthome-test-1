import connexion
import six

from swagger_server.models.api_response import ApiResponse  # noqa: E501
from swagger_server.models.errors import Errors  # noqa: E501
from swagger_server.models.server_status_get import ServerStatusGet  # noqa: E501
from swagger_server.models.temperature_post import TemperaturePost  # noqa: E501
from swagger_server.models.temperature_sensor_get import TemperatureSensorGet  # noqa: E501
from swagger_server.models.temperature_target_get import TemperatureTargetGet  # noqa: E501
from swagger_server import util
from swagger_server.controllers.temperatures_firestore import TempVal
from swagger_server.controllers.token import Token

TV = TempVal()
token = Token()
err = Errors()

def servers_status(jwt):  # noqa: E501
    _tk = token.getToken(jwt)
    t = ServerStatusGet()
    # TODO: Need add serversStatus  !!!
#    t.value = TV.serversStatus if (_tk != None) else None
    return t

def target_temperature(jwt):  # noqa: E501
    t = TemperatureTargetGet()
    _tk = token.getToken(jwt)
    t.value = TV.targetT if (_tk != None) else None
    return t


def temperature_comfort(jwt):  # noqa: E501
    t = TemperatureTargetGet()
    _tk = token.getToken(jwt)
    t.value = TV.comfortT if (_tk != None) else None
    return t


def temperature_econom(jwt):  # noqa: E501
    t = TemperatureTargetGet()
    _tk = token.getToken(jwt)
    t.value = TV.economT if (_tk != None) else None
    return t


def temperature_room(jwt):  # noqa: E501
    t = TemperatureTargetGet()
    _tk = token.getToken(jwt)
    t.value = TV.airT if (_tk != None) else None
    return t


def temperature_water(jwt):  # noqa: E501
    t = TemperatureTargetGet()
    _tk = token.getToken(jwt)
    t.value = TV.waterT if (_tk != None) else None
    return t


def temperature_weather(jwt):  # noqa: E501
    t = TemperatureTargetGet()
    _tk = token.getToken(jwt)
    t.value = TV.weatherT if (_tk != None) else None
    return t


def update_comfort_temperature(body, jwt):  # noqa: E501
    if connexion.request.is_json:
        body = TemperaturePost.from_dict(connexion.request.get_json())  # noqa: E501
        _tk = token.getToken(jwt)
        if (_tk != None):
            TV.comfortT = body.value
    return 'update_comfort_temperature:' + str(TV.comfortT)


def update_econom_temperature(body, jwt):  # noqa: E501
    if connexion.request.is_json:
        body = TemperaturePost.from_dict(connexion.request.get_json())  # noqa: E501
        _tk = token.getToken(jwt)
        if (_tk != None):
            TV.economT = body.value
    return 'update_econom_temperature:' + str(TV.economT)


def update_target_temperature(body, jwt):  # noqa: E501
    if connexion.request.is_json:
#        import pprint
#        import json
#        pp = pprint.PrettyPrinter(indent=4)
#        js = connexion.request.get_json()
#        pp.pprint(js)
#        print(type(js))
#        print(js["id"], js["value"])
        body = TemperaturePost.from_dict(connexion.request.get_json())  # noqa: E501
        _tk = token.getToken(jwt)
        if (_tk != None):
            TV.targetT = body.value
    return 'update_target_temperature:' + str(TV.targetT)
