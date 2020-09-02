#!/bin/bash 

TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGFydElEIjoiMTExIiwibmFtZSI6ItCh0LXRgNCz0LXQuSDQoSIsInRva2VuTnVtYmVyIjoxLCJwcm9qZWN0IjoidGVzdFByb2plY3QtMSIsImlhdCI6MTU5NzczMjY3NiwiZXhwIjozODA2ODU2ODc5fQ.b9rTPTEiBTo-eexqA14TOPP66u0-nWOkjPEFc3047Gk

REQUEST=temperatureWeather
echo -ne "****" $REQUEST
curl -S  -H "Content-Type: application/json" -X GET http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "*************************************************************************"

REQUEST=temperatureRoom
echo -ne "****" $REQUEST
curl -S  -H "Content-Type: application/json" -X GET http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "*************************************************************************"

REQUEST=temperatureWater
echo -ne "****" $REQUEST
curl -S  -H "Content-Type: application/json" -X GET http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "*************************************************************************"

REQUEST=temperatureComfort
echo -ne "****" $REQUEST
curl -S  -H "Content-Type: application/json" -X GET http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "*************************************************************************"

REQUEST=temperatureEconom
echo -ne "****" $REQUEST
curl -S  -H "Content-Type: application/json" -X GET http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "*************************************************************************"

REQUEST=targetTemperature
echo -ne "****" $REQUEST
curl -S  -H "Content-Type: application/json" -X GET http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "*************************************************************************"

REQUEST=serversStatus
echo -ne "****" $REQUEST
curl -S  -H "Content-Type: application/json" -X GET http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "*************************************************************************"

curl -S  -H "Content-Type: application/json" -X POST -d '{"userId":"1", "username": "fizz bizz"}' http://localhost:8080/foo?jwt=123
echo "    <<<<< $REQUEST"
echo "*************************************************************************"

REQUEST=updateTargetTemperature
curl -S -H "Content-Type: application/json" -X POST -d '{"id":"1", "value": "11"}' http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "    <<<<< $REQUEST"
echo "*************************************************************************"

REQUEST=updateComfortTemperature
curl -S -H "Content-Type: application/json" -X POST -d '{"id":"1", "value": "13"}' http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "    <<<<< $REQUEST"
echo "*************************************************************************"

REQUEST=updateEconomTemperature
curl -S -H "Content-Type: application/json" -X POST -d '{"id":"1", "value": "15"}' http://localhost:8080/$REQUEST?jwt=$TOKEN
echo "    <<<<< $REQUEST"
echo "*************************************************************************"
