import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InitService } from 'src/core/services/init/init.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

function initService(sr: InitService): any {
  return () => sr.init();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initService,
      multi: true,
      deps: [InitService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
