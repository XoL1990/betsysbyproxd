import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueComponent } from './value.component';

describe('ValueComponent', () => {
  let component: ValueComponent;
  let fixture: ComponentFixture<ValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct value in euro', () => {
    component.value = 123.66;
    component.currency = 'EUR';
    fixture.detectChanges();
    const valueSpan = fixture.nativeElement.querySelector('span');
    expect(valueSpan).toBeTruthy();
    expect(valueSpan.textContent).toContain('€123.66');
  });

  it('should show string as value', () => {
    component.value = 'Kolorowe`@!3451<>":}{./23@!#(*&^$)';
    fixture.detectChanges();
    const valueSpan = fixture.nativeElement.querySelector('span');
    expect(valueSpan).toBeTruthy();
    expect(valueSpan.textContent).toString();
    expect(valueSpan.textContent).toContain('Kolorowe`@!3451<>":}{./23@!#(*&^$)');
  });
});
