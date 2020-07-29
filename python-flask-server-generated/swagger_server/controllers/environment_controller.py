import connexion
import six

from swagger_server.models.api_response import ApiResponse  # noqa: E501
from swagger_server.models.errors import Errors  # noqa: E501
from swagger_server.models.temperature_post import TemperaturePost  # noqa: E501
from swagger_server.models.temperature_sensor_get import TemperatureSensorGet  # noqa: E501
from swagger_server.models.temperature_target_get import TemperatureTargetGet  # noqa: E501
from swagger_server import util

class TempVal():
    # This is set for temperatures
    targetT: int
    weatherT: int
    airT: int
    comfortT: int
    economT: int
    waterT: int

    def __init__(self):
        self.targetT = 20
        self.weatherT = 20
        self.airT = 20
        self.comfortT = 20
        self.economT = 20
        self.waterT = 20

TV = TempVal()

def target_temperature(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TV.targetT
    return t


def temperature_comfort(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TV.comfortT
    return t


def temperature_econom(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TV.economT
    return t


def temperature_room(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TV.airT
    return t


def temperature_water(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TV.waterT
    return t


def temperature_weather(q=None, idd=None, lat=None, lon=None, zipp=None):  # noqa: E501
    """Call current weather data for one location

     # noqa: E501

    :param q: **City name**. *Example: London*. You can call by city name, or by city name and country code. The API responds with a list of results that match a searching word. For the query value, type the city name and optionally the country code divided by a comma; use ISO 3166 country codes.
    :type q: str
    :param idd: **City ID**. *Example: &#x60;2172797&#x60;*. You can call by city ID. The API responds with the exact result. The List of city IDs can be downloaded [here](http://bulk.openweathermap.org/sample/). You can include multiple cities in this parameter &amp;mdash; just separate them by commas. The limit of locations is 20. *Note: A single ID counts as a one API call. So, if you have city IDs, it&#x27;s treated as 3 API calls.*
    :type idd: str
    :param lat: **Latitude**. *Example: 35*. The latitude coordinate of the location of your interest. Must use with &#x60;lon&#x60;.
    :type lat: str
    :param lon: **Longitude**. *Example: 139*. Longitude coordinate of the location of your interest. Must use with &#x60;lat&#x60;.
    :type lon: str
    :param zipp: **Zip code**. Search by zip code. *Example: 95050,us*. Please note that if the country is not specified, the search uses USA as a default.
    :type zipp: str

    :rtype: TemperatureSensorGet
    """
    print("q", q) # NOTE: "q" - works well, but "id", "zip" and etc. - failed, why?
    print("id", idd)
    print("lat", lat)
    print("lon", lon)
    print("zip", zipp)
#    return {"id":"weather", "name":"city", "value":TempVal.weatherT, "timestamp":"27.07.2020", "status":"true"}
    t = TemperatureTargetGet()
#    t.value = TempVal.weatherT
    t.value = TV.weatherT
    return t


def update_comfort_temperature(body, apartment):  # noqa: E501
    if connexion.request.is_json:
        body = TemperaturePost.from_dict(connexion.request.get_json())  # noqa: E501
        TV.comfortT = body.value
    return 'update_comfort_temperature:' + str(TV.comfortT)


def update_econom_temperature(body, apartment):  # noqa: E501
    if connexion.request.is_json:
        body = TemperaturePost.from_dict(connexion.request.get_json())  # noqa: E501
        TV.economT = body.value
    return 'update_econom_temperature:' + str(TV.economT)


def update_target_temperature(body, apartment):  # noqa: E501
    if connexion.request.is_json:
#        import pprint
#        import json
#        pp = pprint.PrettyPrinter(indent=4)
#        js = connexion.request.get_json()
#        pp.pprint(js)
#        print(type(js))
#        print(js["id"], js["value"])
        body = TemperaturePost.from_dict(connexion.request.get_json())  # noqa: E501
        print(body.to_dict()["id"], body.to_dict()["value"])
        TV.targetT = body.value
    return 'update_target_temperature:' + str(TV.targetT)
