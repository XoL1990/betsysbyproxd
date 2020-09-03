import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';

export interface Team {
  name: string;
  win: number;
}

export interface Bet {
  id: number;
  teams: Team[];
  draw: number;
}

export const listQuery = gql`
  query {
    getBets {
      id
      teams {
        name
        win
      }
      draw
    }
  }
`;

export const subscriptionQuery = gql`
  subscription {
    bets {
      id
      teams {
        win
      }
      draw
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class BetsService {
  query: QueryRef<{ getBets: Bet[] }>;

  constructor(private readonly apollo: Apollo) {
  }

  getBets(): Observable<Bet[]> {
    this.query = this.apollo.watchQuery<{ getBets: Bet[] }>({ query: listQuery });
    return this.query.valueChanges.pipe(map(({ data, errors }) => {
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      return data.getBets;
    }));
  }

  liveBets(): void {
    this.query.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newBets = (subscriptionData.data as { bets: Bet[] }).bets;


        return {
          ...prev,
          newBets
        };
      }
    });
  }
}
