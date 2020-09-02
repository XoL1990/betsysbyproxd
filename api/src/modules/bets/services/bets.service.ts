import { Injectable, HttpService, Global } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { take, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Bet } from '../models/bet';
const io = require('socket.io-client');

@Injectable()
export class BetsService {

  clients = 0;
  pubSub = new PubSub();
  socket = null;

  constructor(private http: HttpService) { }

  public async getBets() {
    return await this.http.get(`${process.env.BETSYS_URL}bets`)
      .pipe(
        map(response => response.data)
      )
      .pipe(catchError(val => of(`I caught: ${val}`)))
      .pipe(take(1)).toPromise();
  }

  public getBetSubscription() {
    console.log('getBetSubscription');
    return this.pubSub.asyncIterator('betsUpdated');
  }

  public onConnect() {
    if (this.clients == 0) {
      this.togglePulling(true);
    }
    this.clients++;
    console.log("onConnected " + this.clients);
  }

  public onDisconnect() {
    this.clients--;
    if (this.clients == 0) {
      this.togglePulling(false);
    }
    console.log("onDisconnected " + this.clients);
  }

  private togglePulling(enable: boolean) {
    const url = `${process.env.BETSYS_URL}pulling/${enable ? 'start?rate=1' : 'stop'}`;
    this.http.get(url)
      .pipe(
        map(response => response.data)
      )
      .pipe(catchError(val => of(`I caught: ${val}`)))
      .pipe(take(1))
      .subscribe(data => {
        console.log(data);
      });

    if (enable) {
      this.socket = io.connect(process.env.BETSYS_URL, {
        reconnection: true
      });
      this.socket.on('bet-updated', (data: Bet[]) => {
        console.log('betsUpdated');
        this.pubSub.publish('betsUpdated', { bets: data })
      });
    }
    else if (this.socket != null) {
      this.socket.close()
      this.socket = null;
    }
  }
}
