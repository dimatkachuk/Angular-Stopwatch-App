export class TimerState {
  milliseconds: number;
  seconds: number;
  minutes: number;
  running: boolean;
  delimetersShown: boolean;

  constructor(milliseconds, seconds, minutes, running, delimetersShown) {
    this.milliseconds = milliseconds,
    this.seconds = seconds,
    this.minutes = minutes,
    this.running = running,
    this.delimetersShown = delimetersShown
    }

  public equals(other: any): boolean {
    if (this.milliseconds !== other.milliseconds || this.seconds !== other.seconds || this.minutes !== other.minutes || this.running !== other.running || this.delimetersShown !== other.delimetersShown) {
      console.log('not equals')
      return false;
    } else {
      console.log('equals')
      return true;
    }
  }
}
