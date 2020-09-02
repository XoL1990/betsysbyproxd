import { Component, OnDestroy, OnInit } from '@angular/core';
import { BetsService, Bet, Team } from './services/bets.service';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  private static CURRENCY_KEY = "CURRENCY";
  private static LOCALE_KEY = "LOCALE";

  public currency: string;
  public locale: string;

  public bets: Bet[] = [];
  public error: string = null;
  public loading = true;

  public team1String = $localize`Team 1`;
  public team2String = $localize`Team 2`;
  public winString = $localize`Win`;
  public drawString = $localize`Draw`;

  private betsSubscription: Subscription;

  constructor(private betsService: BetsService) { }

  ngOnInit() {
    this.currency = localStorage.getItem(AppComponent.CURRENCY_KEY);
    if (!this.currency) {
      this.currency = 'EUR';
    }

    this.locale = localStorage.getItem(AppComponent.LOCALE_KEY);
    if (!this.locale) {
      this.locale = 'EN';
    }

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

  public setCurrency(currency: string) {
    localStorage.setItem(AppComponent.CURRENCY_KEY, currency);
    this.currency = currency;
  }

  public setLocale(locale: string) {
    if (!environment.production) {
      alert('In development mode you cannot switch languages');
      return;
    }
    localStorage.setItem(AppComponent.LOCALE_KEY, locale);
    this.locale = locale;
    window.location.href = `/${locale.toLowerCase()}`
  }
}
