## Usage
To run the server, please execute the following from the root directory:

virtualenv env (только первый раз!)
 
После того, как все настроено, надо заморозить виртуальное окружение и сохранить его описание командами:
Сохранить:
pip freeze > requirements.txt
Восстановить в следующий раз:
pip install -r requirements.txt

source env/bin/activate
python3 main.py

or
./start.sh

To check if server started:
./check_app_status.sh