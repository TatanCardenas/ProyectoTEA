// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  HOST: 'http://localhost:60602/api/',
  TOKEN: 'token',
  firebase:{
    apiKey: "AIzaSyA0QAlCxmWmGe3YNFDN2uKnXgGhM0fSt9o",
    authDomain: "proyectotea-c32d7.firebaseapp.com",
    projectId: "proyectotea-c32d7",
    storageBucket: "proyectotea-c32d7.appspot.com",
    messagingSenderId: "1000484449944",
    appId: "1:1000484449944:web:af06ff36ff0f1206346aed"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
