## Usage
To run the server, please execute the following from the root directory:


virtualenv --python=python3 env  (только первый раз!)
source env/bin/activate
pip install -r requirements.txt

После того, как все настроено, надо заморозить виртуальное окружение и сохранить его описание командами:
Сохранить:
pip freeze > requirements.txt
Восстановить в следующий раз:
pip install -r requirements.txt

source env/bin/activate
python3 main.py

or
./start.sh
---------------------
For Test checkAlert() function need start with any argument ("xyz")
python3 main.py xyz
---------------------


To check if server started:
./check_app_status.sh

--------------

Deploy to Google Cloud:
gcloud app deploy

--------------
## Autostart:
# https://www.linode.com/docs/quick-answers/linux/start-service-at-boot/
# https://sysadmin.ru/articles/avtozapusk-v-linux

#cat apiserver.service 
# PATH: /lib/systemd/system  
[Unit]
Decription=API Server Autostart script
After=multi-user.target

[Service]
Type=idle
ExecStart=/root/Work/ionic-smarthome-test-1/web_serv/start.sh
RestartSec=30
Restart=always

[Install]
WantedBy=multi-user.target

--------------
