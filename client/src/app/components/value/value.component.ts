import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnInit {

  public state = 0;
  public isString = false;

  private actualValue: number | string = 0;
  private resetTimeout = null;

  get value(): number | string {
    return this.actualValue;
  }

  @Input() set value(v: number | string) {
    if (typeof (v) === 'string') {
      this.isString = true;
    }
    if (this.actualValue > v) {
      this.state = -1;
    }
    else if (this.actualValue < v) {
      this.state = 1;
    }
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    this.resetTimeout = setTimeout(() => {
      this.state = 0;
    }, 1000);
    this.actualValue = v;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
