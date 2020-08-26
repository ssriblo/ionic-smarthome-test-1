# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.api_response import ApiResponse  # noqa: E501
from swagger_server.models.errors import Errors  # noqa: E501
from swagger_server.models.server_status_get import ServerStatusGet  # noqa: E501
from swagger_server.models.temperature_post import TemperaturePost  # noqa: E501
from swagger_server.models.temperature_sensor_get import TemperatureSensorGet  # noqa: E501
from swagger_server.models.temperature_target_get import TemperatureTargetGet  # noqa: E501
from swagger_server.test import BaseTestCase


class TestEnvironmentController(BaseTestCase):
    """EnvironmentController integration test stubs"""

    def test_servers_status(self):
        """Test case for servers_status

        
        """
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/serversStatus',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_target_temperature(self):
        """Test case for target_temperature

        
        """
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/targetTemperature',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_comfort(self):
        """Test case for temperature_comfort

        
        """
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/temperatureComfort',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_econom(self):
        """Test case for temperature_econom

        
        """
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/temperatureEconom',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_room(self):
        """Test case for temperature_room

        
        """
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/temperatureRoom',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_water(self):
        """Test case for temperature_water

        
        """
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/temperatureWater',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_weather(self):
        """Test case for temperature_weather

        Call current weather data for one location
        """
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/temperatureWeather',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_comfort_temperature(self):
        """Test case for update_comfort_temperature

        
        """
        body = TemperaturePost()
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/updateComfortTemperature',
            method='POST',
            data=json.dumps(body),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_econom_temperature(self):
        """Test case for update_econom_temperature

        
        """
        body = TemperaturePost()
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/updateEconomTemperature',
            method='POST',
            data=json.dumps(body),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_target_temperature(self):
        """Test case for update_target_temperature

        
        """
        body = TemperaturePost()
        query_string = [('jwt', 'jwt_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.7/updateTargetTemperature',
            method='POST',
            data=json.dumps(body),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
