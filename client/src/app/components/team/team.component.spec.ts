import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamComponent } from './team.component';

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a team name with value component', () => {
    component.team = { name: 'Hokus pokus', win: 123.45 };
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const nameDiv = compiled.querySelector('.name');
    expect(nameDiv).toBeTruthy();
    expect(nameDiv.textContent).toContain('Hokus pokus');
    const valueComponent = compiled.querySelector('app-value');
    expect(valueComponent).toBeTruthy();
  });
});
