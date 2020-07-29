# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.api_response import ApiResponse  # noqa: E501
from swagger_server.models.errors import Errors  # noqa: E501
from swagger_server.models.temperature_post import TemperaturePost  # noqa: E501
from swagger_server.models.temperature_sensor_get import TemperatureSensorGet  # noqa: E501
from swagger_server.models.temperature_target_get import TemperatureTargetGet  # noqa: E501
from swagger_server.test import BaseTestCase


class TestEnvironmentController(BaseTestCase):
    """EnvironmentController integration test stubs"""

    def test_target_temperature(self):
        """Test case for target_temperature

        
        """
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/targetTemperature/{apartment}'.format(apartment=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_comfort(self):
        """Test case for temperature_comfort

        
        """
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/temperatureComfort/{apartment}'.format(apartment=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_econom(self):
        """Test case for temperature_econom

        
        """
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/temperatureEconom/{apartment}'.format(apartment=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_room(self):
        """Test case for temperature_room

        
        """
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/temperatureRoom/{apartment}'.format(apartment=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_water(self):
        """Test case for temperature_water

        
        """
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/temperatureWater/{apartment}'.format(apartment=56),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_temperature_weather(self):
        """Test case for temperature_weather

        Call current weather data for one location
        """
        query_string = [('q', 'q_example'),
                        ('idd', 'idd_example'),
                        ('lat', 'lat_example'),
                        ('lon', 'lon_example'),
                        ('zipp', 'zipp_example')]
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/temperatureWeather',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_comfort_temperature(self):
        """Test case for update_comfort_temperature

        
        """
        body = TemperaturePost()
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/updateComfortTemperature/{apartment}'.format(apartment=56),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_econom_temperature(self):
        """Test case for update_econom_temperature

        
        """
        body = TemperaturePost()
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/updateEconomTemperature/{apartment}'.format(apartment=56),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_target_temperature(self):
        """Test case for update_target_temperature

        
        """
        body = TemperaturePost()
        response = self.client.open(
            '/OVK/OVK_mob1/1.0.5/updateTargetTemperature/{apartment}'.format(apartment=56),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
