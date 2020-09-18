# ionic-smarthome-test-1
first step to try ionic/angular/ion-range/ion-button
------------------------------

web server at 

/ionic-smarthome-test-1/web_serv

mobile app at 

/ionic-smarthome-test-1/otoplenok

------------------------------

For start:

at /ionic-smarthome-test-1/otoplenok

ionic serve

If server localy
at ionic-smarthome-test-1/web_serv

python3 main.py

If server at   'https://web-serv13802.nw.r.appspot.com/api/post_data' then it works for one year, till June, 2021


------------------------------

Local web page for server 
http://127.0.0.1:8080/

Google server for test:

'https://web-serv13802.nw.r.appspot.com/api/post_data'


Local web page for mobile app 

http://localhost:8100/home

------------------------------

API info here:

https://docs.google.com/document/d/15_ilb4IovJb3VzQhDWFglsMPrPfXvudJFAII0vpKjVo/edit?usp=sharing

Development info here:

https://docs.google.com/document/d/1bT5rUsMWw_h5lW6ldFuMi0xZduEhXNo_R2Vjom3nCiI/edit?usp=sharing

------------------------------
For Android apk file:

1) ionic build

2) npm update

3) npx cap init

4) ionic cap add android

5) npx cap open android >> issue at Linux:

npx cap open android
[info] Opening Android project at /home/me/Working/Angular/Angular_20h_course/ionic-smarthome-test-1/otoplenok/android
[error] Unable to launch Android Studio. You must configure "linuxAndroidStudioPath" in your capacitor.config.json to point to the location of studio.sh, using JavaScript-escaped paths:
Example:
{
  "linuxAndroidStudioPath": "/usr/local/android-studio/bin/studio.sh"
}

------------------
Строим мобильное приложение
~/Working/Angular/Angular_20h_course/ionic-smarthome-test-1/otoplenok/src$ npx cap init

Follow the Developer Workflow guide to get building: https://capacitor.ionicframework.com/docs/basics/workflow

ionic cap add android

Заработало построение apk файл на Linux!

--------------------------
