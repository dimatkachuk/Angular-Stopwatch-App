import { Component, OnInit, Input, Output, HostListener, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-timestamp',
  templateUrl: './timestamp.component.html',
  styleUrls: ['./timestamp.component.css']
})
export class TimestampComponent implements OnInit {
  @Input() timestamp;
  @Output() onRemoveTimestamp = new EventEmitter<number>();
  // Booloean variables which corresponds to REMOVE button appearence
  isButtonVisible = false;
  
  @HostListener('mouseenter') onMouseEnter() {
    this.isButtonVisible = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.isButtonVisible = false;
  }

  ngOnInit() {
  }

  removeTimestamp(timestampId: number) {
    this.onRemoveTimestamp.emit(timestampId);
  }


}
