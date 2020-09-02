import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent implements OnInit {

  public state = 0;
  public isString = false;

  private actualCurrency: string;

  private originalValue = 0;
  private actualValue: number | string = 0;
  private resetTimeout = null;

  get value(): number | string {
    return this.actualValue;
  }

  get currency(): string {
    return this.actualCurrency
  }

  @Input() set currency(currency: string) {
    this.actualCurrency = currency;
    if (typeof this.actualValue === 'number') {
      this.actualValue = currency === 'EUR' ? this.originalValue : this.originalValue * 4.2;
    }
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
    if (typeof v === 'string') {
      this.actualValue = v;
    }
    else {
      this.originalValue = v;
      this.actualValue = this.currency === 'EUR' ? v : v * 4.2;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
