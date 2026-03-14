import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);



// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { AppComponent } from './app/app.component';
// import  {JwtInterceptor}  from './app/core/interceptors/jwt.interceptor';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(withInterceptors([JwtInterceptor]))
//   ]
// });
