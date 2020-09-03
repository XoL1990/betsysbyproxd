import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.scss']
})
export class ValueComponent {

  public state = 0;
  public isString = false;

  private actualCurrency: string;

  private originalValue = 0;
  private actualValue: number | string = 0;
  private resetTimeout = null;

  get currency(): string {
    return this.actualCurrency;
  }

  @Input() set currency(currency: string) {
    this.actualCurrency = currency;
    if (typeof this.actualValue === 'number') {
      this.actualValue = currency === 'EUR' ? this.originalValue : this.originalValue * 4.2;
    }
  }

  get value(): number | string {
    return this.actualValue;
  }

  @Input() set value(value: number | string) {
    if (typeof (value) === 'string') {
      this.isString = true;
      this.actualValue = value;
      return;
    }
    this.updateState(value);
    this.originalValue = value;
    this.actualValue = this.currency === 'EUR' ? value : value * 4.2;
  }

  private updateState(value: number): void {
    if (this.actualValue > value) {
      this.state = -1;
    }
    else if (this.actualValue < value) {
      this.state = 1;
    }
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    this.resetTimeout = setTimeout(() => {
      this.state = 0;
    }, 1000);
  }
}
