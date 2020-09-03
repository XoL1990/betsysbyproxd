import { HttpService, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { Bet } from '../models/bet';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io-client');

@Injectable()
export class BetsService {
  clients = 0;
  pubSub = new PubSub();
  socket = null;

  constructor(private http: HttpService) {}

  public async getBets(): Promise<Bet[]> {
    return await this.http
      .get(`${process.env.BETSYS_URL}bets`)
      .pipe(map(response => response.data))
      .pipe(catchError(val => of(`I caught: ${val}`)))
      .pipe(take(1))
      .toPromise();
  }

  public getBetSubscription(): AsyncIterator<Bet[]> {
    console.log('getBetSubscription');
    return this.pubSub.asyncIterator('betsUpdated');
  }

  public onConnect(): void {
    if (this.clients == 0) {
      this.togglePulling(true);
    }
    this.clients++;
    console.log('onConnected ' + this.clients);
  }

  public onDisconnect(): void {
    this.clients--;
    if (this.clients < 0) {
      // Should not occurs... But... On free server like heroku can be possible.
      // Check here: https://devcenter.heroku.com/articles/error-codes#h15-idle-connection
      this.clients = 0;
    }
    if (this.clients == 0) {
      this.togglePulling(false);
    }
    console.log('onDisconnected ' + this.clients);
  }

  private togglePulling(enable: boolean) {
    const urlPart = enable ? 'start?rate=1' : 'stop';
    const url = `${process.env.BETSYS_URL}pulling/${urlPart}`;
    this.http
      .get(url)
      .pipe(map(response => response.data))
      .pipe(catchError(val => of(`I caught: ${val}`)))
      .pipe(take(1))
      .subscribe(data => {
        console.log(data);
      });

    if (enable) {
      this.socket = io.connect(process.env.BETSYS_URL, {
        reconnection: true,
      });
      this.socket.on('bet-updated', (data: Bet[]) => {
        console.log('betsUpdated');
        this.pubSub.publish('betsUpdated', { bets: data });
      });
    } else if (this.socket != null) {
      this.socket.close();
      this.socket = null;
    }
  }
}
