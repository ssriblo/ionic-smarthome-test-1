// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  forceWriteJwt: true, // Force write down JWT to Local Store without QR code scane. Used for Chrome test only
  forceDeleteJwt: false, // Force delete JWT from Local Store - for test only !!
  mobileBuild: false, // setup FALSE for Chrome and TRUE for Android
  serverLocal: true, // setup TRUE if local server and FALSE if Google Server
  SERVER_URL_LOCAL: 'http://localhost:8080/OVK/OVK_mob1/1.0.7/',
  SERVER_URL_GOOGLE: 'https://web-serv13802.nw.r.appspot.com/api/post_data',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
