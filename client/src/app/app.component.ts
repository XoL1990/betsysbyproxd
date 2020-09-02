import { Component, OnDestroy, OnInit } from '@angular/core';
import { BetsService, Bet, Team } from './services/bets.service';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  public bets: Bet[] = [];
  public error: string = null;
  public loading = true;

  private betsSubscription: Subscription;

  constructor(private betsService: BetsService) { }

  ngOnInit() {
    this.betsSubscription = this.betsService.getBets()
      .pipe(catchError(val => of(`${val}`)))
      .subscribe(bets => {
        if (typeof bets === 'string') {
          this.error = bets;
        }
        else {
          this.error = null;
          this.bets = bets;
        }
        this.loading = false;
      });
    this.betsService.liveBets();
  }

  ngOnDestroy() {
    if (this.betsSubscription) {
      this.betsSubscription.unsubscribe();
    }
  }

  public getTeam(bet: Bet, teamNumber: number): Team {
    if (bet.teams.length > teamNumber) {
      return bet.teams[teamNumber];
    }
    return null;
  }

  public trackBy(index: number, item: Bet) {
    return item.id;
  }
}
