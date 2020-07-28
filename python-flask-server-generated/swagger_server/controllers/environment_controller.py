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
    targetT = 20
    weatherT = 20
    airT = 20
    comfortT = 20
    economT = 20
    waterT = 20


def target_temperature(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TempVal.targetT
    return t


def temperature_comfort(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TempVal.comfortT
    return t


def temperature_econom(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TempVal.economT
    return t


def temperature_room(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TempVal.airT
    return t


def temperature_water(apartment):  # noqa: E501
    t = TemperatureTargetGet()
    t.value = TempVal.waterT
    return t


def temperature_weather(q=None, idd=None, lat=None, lon=None, zipp=None):  # noqa: E501
    """Call current weather data for one location

     # noqa: E501

    :param q: **City name**. *Example: London*. You can call by city name, or by city name and country code. The API responds with a list of results that match a searching word. For the query value, type the city name and optionally the country code divided by a comma; use ISO 3166 country codes.
    :type q: str
    :param id: **City ID**. *Example: &#x60;2172797&#x60;*. You can call by city ID. The API responds with the exact result. The List of city IDs can be downloaded [here](http://bulk.openweathermap.org/sample/). You can include multiple cities in this parameter &amp;mdash; just separate them by commas. The limit of locations is 20. *Note: A single ID counts as a one API call. So, if you have city IDs, it&#x27;s treated as 3 API calls.*
    :type id: str
    :param lat: **Latitude**. *Example: 35*. The latitude coordinate of the location of your interest. Must use with &#x60;lon&#x60;.
    :type lat: str
    :param lon: **Longitude**. *Example: 139*. Longitude coordinate of the location of your interest. Must use with &#x60;lat&#x60;.
    :type lon: str
    :param zip: **Zip code**. Search by zip code. *Example: 95050,us*. Please note that if the country is not specified, the search uses USA as a default.
    :type zip: str

    :rtype: TemperatureSensorGet
    """
    print("q", q) # NOTE: "q" - works well, but "id", "zip" and etc. - failed, why?
    print("id", idd)
    print("lat", lat)
    print("lon", lon)
    print("zip", zipp)
    return {"id":"weather", "name":"city", "value":TempVal.weatherT, "timestamp":"27.07.2020", "status":"true"}


def update_comfort_temperature(body, apartment):  # noqa: E501
    if connexion.request.is_json:
        body = TemperaturePost.from_dict(connexion.request.get_json())  # noqa: E501
        TempVal.comfortT = body.value
    return 'update_comfort_temperature:' + str(TempVal.comfortT)


def update_econom_temperature(body, apartment):  # noqa: E501
    if connexion.request.is_json:
        body = TemperaturePost.from_dict(connexion.request.get_json())  # noqa: E501
        TempVal.economT = body.value
    return 'update_econom_temperature:' + str(TempVal.economT)


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
        TempVal.targetT = body.value
    return 'update_target_temperature:' + str(TempVal.targetT)
