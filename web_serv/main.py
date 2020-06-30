import datetime
from flask import Flask, render_template, request
from flask_cors import CORS
import requests

appid = "50e08dd0d8d2eb95eecb9e43d0a6c260"# полученный при регистрации на OpenWeatherMap.org. Что-то вроде такого набора букв и цифр: "6d8e495ca73d5bbc1d6bf8ebd52c4123"

# Запрос текущей погоды
def request_current_weather(city_id):
    try:
        res = requests.get("http://api.openweathermap.org/data/2.5/weather",
                     params={'id': city_id, 'units': 'metric', 'lang': 'ru', 'APPID': appid})
        data = res.json()
#        print("conditions:", data['weather'][0]['description'])
#        print("temp:", data['main']['temp'])
#        print("temp_min:", data['main']['temp_min'])
#        print("temp_max:", data['main']['temp_max'])
#        print("data:", data)
    except Exception as e:
        print("Exception (weather):", e)
        pass
    return data['main']['temp']

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return "<form>  Curtain Opening Time: <br><input type =\"text\" name=\"Curtain_OPENTIME\"><br></form>"


# POST Request example:
# curl -i -H "Content-Type: text/html; charset=UTF-8" -X POST -d '{"12345"}'  http://127.0.0.1:8080/api/post_data
# return:
#POST allright b'{"12345"}'
@app.route("/api/post_data", methods=['POST', 'GET'])
def post_fun():
    weather_temp = request_current_weather(520555,) # 520555 - Nizhniy Novgorod
#    print(">1 ",request.path, " >2")
#    print(">2 ",request.pragma, " >2")
#    print(">3 ",request.view_args, " >2")
#    print(">4 ",request.query_string, " >2")
#    print(">5 ",request.args, " >2")
#    print(">6 ",request.data, " >2")
#    print(">7 ",request.get_data(), " >2")
    data = request.json
    print("TARGET t=", data, type(data), data['target_t'])
    room_temp = data['target_t'] - 1.5
    return {'room_temp': room_temp,  'weather_temp': weather_temp}

@app.route('/api3')
def api2():
    return 'Hello API World'

@app.route('/temperature/<temperature_c>')
def show_user_profile(temperature_c):
    # показать профиль данного пользователя
    return '<h1>Целевая температура %s </h1>' % temperature_c

#@app.route('/post/<int:post_id>')
@app.route('/post/<post_id>')
def show_post(post_id):
    # вывести сообщение с данным id, id - целое число
    return 'Post %s' % post_id



if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)

