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
ionic build
npx cap add android
npx cap copy
npx cap update <only after new plugin installed >
npx cap sync  <not needed in most cases>
npx cap open android

>> issue at Linux:
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
Если отлаживать на Android SDK с отладкой по USB, то каждый раз после изменения кода делать:
ionic capacitor copy android
затем в Android SDK - "rebuild"

--------------------------
Push notification uses OneSignal well and tested following well:
curl --include \
     --request POST \
     --header "Content-Type: application/json; charset=utf-8" \
     --header "Authorization: Basic Z.....................................A0" \
     --data-binary "{\"app_id\": \"8a1db084-b465-4cf6-8e12-22d38f8c9a14\",
\"contents\": {\"en\": \"АВАРИЯ - ПРОТЕЧКА!\"},
\"headings\": {\"en\": \"Внимание !\"},
\"data\": {\"task\": \"АВАРИЯ - ПРОТЕЧКА!\"},
\"included_segments\": [\"Subscribed Users\"]}" \
     https://onesignal.com/api/v1/notifications

