import { Resolver, Subscription, Query } from '@nestjs/graphql';
import { BetsService } from '../services/bets.service';
import { Bet } from '../models/bet';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver()
export class BetsResolver {
  constructor(private readonly betsService: BetsService) {}

  @Query(() => [Bet])
  getBets(): Promise<Bet[]> {
    return this.betsService.getBets().then(value => {
      if (typeof value === 'string') {
        throw new HttpException(
          'BetSys probably is offline',
          HttpStatus.FORBIDDEN,
        );
      }
      return value;
    });
  }

  @Subscription(() => [Bet])
  bets(): AsyncIterator<Bet[]> {
    return this.betsService.getBetSubscription();
  }
}
