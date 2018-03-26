import { Component, OnInit, Inject } from '@angular/core';
import { TimerState } from '../TimerState';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  // Variables to save time and timestamps
  state = new TimerState(0,0,0,false,true);
  timestamps = [];
  timestampsCount = 0;
  // Variables to save 'setInterval' functions
  tick = null;
  delimetersTick;

  constructor(private storageService: StorageService) {
  }

  // In initialization hook firstly events are binded to
  // components functions and then state of the app is taken
  // from Local Storage
  ngOnInit() {
    this.eventsBindings();
    this.getStorage();
  }

  ///////////////////////////////////////////////////////////
  // Section 1. Components' functions to cooperate with
  // Local storage using Storage Service
  ///////////////////////////////////////////////////////////

  eventsBindings() {
    window.addEventListener('storage', this.getStorage.bind(this));
    window.onload = this.incrementAppNumber.bind(this);
    window.onbeforeunload = this.decrementAppNumber.bind(this);
  }

  // This function is binded to event of opening App in new tab
  // to count number of App opened in browser
  incrementAppNumber(): void {
      var applicationCount = this.storageService.getData("applicationCount");
      if (!applicationCount) {
        applicationCount = 0;
      }
      console.log(applicationCount);
      this.storageService.storeData("applicationCount", applicationCount + 1);
  }

  // This function is oposite to 'incrementAppNumber' function, it binds to event
  // of tab being closed and decrements number of opened apps.
  decrementAppNumber(): void {
        var applicationCount = this.storageService.getData("applicationCount");
        console.log(applicationCount);
        this.storageService.storeData("applicationCount", applicationCount - 1);
  }

  // Current function extract all data from Local Storage using
  // Storage Service. It checks if data is available in Local Storage,
  // extracts it in component variables and restore time if application
  // was closed, but was not stoped and timer should go on background.
  getStorage() : void {
    var stateData = this.storageService.getData('state');
    var timestampsData = this.storageService.getData('timestamps');
    var timestampsCountData = this.storageService.getData('timestampsCount');
    // On Application first run storage will be empty,
    // so we should not update state
    if (stateData) {
      if (!this.state.equals(stateData)) {
            this.state = new TimerState(stateData.milliseconds,stateData.seconds,stateData.minutes,stateData.running,stateData.delimetersShown);
      }
      // This block inside if statement controls time restoring.
      // If app will be closed when timer is ticking and will be opened in,
      // for instance, 30 seconds this block of code will restore time.
      if (this.state.running) {
        var StateUpdatingTimestamp = this.storageService.getData('StateUpdatingTS');
        var currentTime = Date.parse(new Date().toISOString());
        var timePassed = currentTime - StateUpdatingTimestamp;
        if (timePassed > 150) {
          console.log('Need to restore');
          this.restoreTime(timePassed);
          if (this.storageService.getData('applicationCount') < 1) {
            this.tick = this.runTimer();
            this.delimetersTick = this.runDelimetersTicking();
          }
        }
      }
    }
    // if timestamps is undefined we should not even
    // check for update
    if (timestampsData) {
      if (timestampsData.length !== this.timestamps.length) {
        this.timestamps = timestampsData;
        this.timestampsCount = timestampsCountData;
      }
    }
    // Adittional check for running as in reality only one tab is ticking
    // and if you will pause in another tab it won't stop ticking so we need
    // to do it externally.
    if (!this.state.running && this.tick) {
      clearInterval(this.tick);
      clearInterval(this.delimetersTick);
    }
  }

  // This function does calculations needed for time restoring
  // in function getStorage.
  restoreTime(time: number): void {
    var timePassed = Math.floor(time / 10);
    var passedMilliseconds = timePassed % 100;
    var passedSeconds = Math.floor(timePassed / 100);
    var passedMinutes = Math.floor(passedSeconds / 60);
    //Restoring milliseconds
    var milliseconds = this.state.milliseconds + passedMilliseconds;
    if (milliseconds > 100) {
      this.state.milliseconds = milliseconds % 100;
      this.state.seconds += 1;
    } else {
      this.state.milliseconds = milliseconds;
    }
    //Restoring seconds
    var seconds = this.state.seconds + passedSeconds;
    if (seconds > 60) {
      this.state.seconds = seconds % 60;
      this.state.minutes += 1;
    } else {
      this.state.seconds = seconds;
    }
    //Restoring minutes
    this.state.minutes += passedMinutes;
  }

  // Function which using Storage Service store state variable
  // to Local Storage
  saveStateInStorage(): void {
    this.storageService.storeData('state', this.state);
    // This line will store timestamp of Storage updating with new state.
    // See explanation of why do we need it earlier in getStorage function.
    var currentTime = new Date().toISOString();
    this.storageService.storeData('StateUpdatingTS', Date.parse(currentTime));
  }

  // Function which using Storage Service store timestamps info
  // to Local Storage
  saveTimestampsInStorage(): void {
    this.storageService.storeData('timestamps',this.timestamps);
    this.storageService.storeData('timestampsCount', this.timestampsCount);
  }

  ///////////////////////////////////////////////////////////
  // Section 2. Components' functions to operate with Timer
  ///////////////////////////////////////////////////////////

  // Function which return Interval function to increment time
  runTimer() {
    return setInterval(()=>{
      this.state.milliseconds += 1;
      if (this.state.milliseconds >= 100) {
        this.state.milliseconds = 0;
        this.state.seconds += 1;
      }
      if (this.state.seconds >= 60) {
        this.state.seconds = 0;
        this.state.minutes += 1;
      }
      this.saveStateInStorage();
    },10);
  }

  // Function which retrun interval function to control
  // delimeters ticking
  runDelimetersTicking() {
    return setInterval(()=>{
      if (this.state.delimetersShown) {
        this.state.delimetersShown = false;
      } else {
        this.state.delimetersShown = true;
      }
    },1000);
  }

  // Function which is binded to Play/Pause button and toggle
  // state variable between those two states
  toggleTime(): void {
    if (this.state.running) {
      this.state.running = false;
      clearInterval(this.tick);
      this.state.delimetersShown = true;
      clearInterval(this.delimetersTick);
      this.saveStateInStorage();
    } else {
      // Start running the timer
      this.state.running = true;
      // Incrementing time each millisecond
      this.tick = this.runTimer();
      // Start delimeters to tick each second
      this.delimetersTick = this.runDelimetersTicking();

    }
  }

  // Function which is binded to stopwatch button and adds new timestamp on press
  addTimestamp(): void {
    this.timestamps.unshift({id: this.timestampsCount, minutes: this.state.minutes, seconds: this.state.seconds, milliseconds: this.state.milliseconds});
    this.timestampsCount += 1;
    this.saveTimestampsInStorage();
  }

  // Function which executes in timer component when REMOVE button in
  // Timestamp component is pressed. It removes timestamp by id from
  // timestamps list.
  onRemoveTimestamp(timestampId: number): void {
    for (var i = 0; i < this.timestamps.length; i++) {
      if (this.timestamps[i].id == timestampId) {
        this.timestamps.splice(i,1);
        this.saveTimestampsInStorage();
        break;
      }
    }
  }

  // Function which is binded to Reset button and it resets all variables of component.
  resetAll(): void {
    clearInterval(this.tick);
    clearInterval(this.delimetersTick);
    this.state.delimetersShown = true;
    this.state.milliseconds = 0;
    this.state.seconds = 0;
    this.state.minutes = 0;
    this.state.running = false;
    this.timestamps = [];
    this.timestampsCount = 0;
    this.saveStateInStorage();
    this.saveTimestampsInStorage();
  }
}
