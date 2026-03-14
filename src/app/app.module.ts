// // import { NgModule } from '@angular/core';
// // import { HTTP_INTERCEPTORS } from '@angular/common/http';
// // // import { JwtInterceptor } from '@angular/material/core/interceptors/jwt.interceptor';
// // import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';

// // @NgModule({
// //   providers: [
// //     {
// //       provide: HTTP_INTERCEPTORS,
// //       useClass: JwtInterceptor,
// //       multi: true
// //     }
// //   ]
// // })
// // export class AppModule {
// //   constructor() {
// //     console.log("I am in AppModule");
// //   }
// // }

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AppComponent } from './app.component';
// import JwtInterceptor from 'src/app/core/interceptors/jwt.interceptor';
// import { MaterialModule } from './material.module'; // adjust path as needed

// @NgModule({
//   declarations: [
//     // other components
//   ],
//   imports: [
//     BrowserModule,
//     AppComponent,
//     MaterialModule, // import your custom material module
//     // other modules
//   ],
//   providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: JwtInterceptor,
//       multi: true
//     }
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule {
//   constructor() {
//     console.log('I am in AppModule');
//   }
// }
