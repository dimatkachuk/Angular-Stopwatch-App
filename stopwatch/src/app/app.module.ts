import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StorageService } from './storage.service';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { TimestampComponent } from './timestamp/timestamp.component';
import { TimePipe } from './time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    TimestampComponent,
    TimePipe,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [
    StorageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
