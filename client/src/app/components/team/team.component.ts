import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'src/app/services/bets.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  @Input() team: Team;
  @Input() currency: string;

  constructor() { }

  ngOnInit(): void {
  }

}
