// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mobileBuild: false, // setup FALSE for Chrome and TRUE for Android
  version: "(v38) ",
  serverLoc: "cloud", // options: ["local", "cloud"]
//  SERVER_URL_LOCAL: 'http://localhost:8080/OVK/OVK_mob1/1.0.7/',
  SERVER_URL_LOCAL: 'http://localhost:8080/',
// this project banned and disabled SERVER_URL_GOOGLE: 'https://web-serv13802.nw.r.appspot.com:8080/OVK/OVK_mob1/1.0.7/',
// SERVER_URL_GOOGLE: 'https://smart-home-288104.ew.r.appspot.com:8080/OVK/OVK_mob1/1.0.7/',
//  SERVER_URL_GOOGLE: 'http://84.201.154.208:8080/OVK/OVK_mob1/1.0.7/',
//  SERVER_URL_GOOGLE: 'https://84.201.154.208:8080/', 
  SERVER_URL_GOOGLE: 'https://otoplenok.ru:8080/', 
  
  JWT_DEFAULT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGFydElEIjoiMTExIiwibmFtZSI6ItCh0LXRgNCz0LXQuSDQoSIsInRva2VuTnVtYmVyIjoxLCJwcm9qZWN0IjoidGVzdFByb2plY3QtMSIsImlhdCI6MTU5NzczMjY3NiwiZXhwIjozODA2ODU2ODc5fQ.b9rTPTEiBTo-eexqA14TOPP66u0-nWOkjPEFc3047Gk',
  
//  ONESIGNAL_APP_ID: '8a1db084-b465-4cf6-8e12-22d38f8c9a14', //project "otoplenok" - old, stale
  ONESIGNAL_APP_ID: '487ca18b-55e2-4f1f-a250-5319a0921be7', // project "otoplenok2" - new one
  
//  ANDROID_ID: '116945727421', //project "otoplenok" - old, stale
  ANDROID_ID: '418819770816', // project "otoplenok2" - new one

  ALERT_STORED_MAX: 20,

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
