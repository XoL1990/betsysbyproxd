import { NgModule } from '@angular/core';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { environment } from '../environments/environment';
import { Team } from './services/bets.service';

@NgModule({
  imports: [HttpLinkModule]
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const http = httpLink.create({ uri: `${environment.api_url}/graphql` });
    const ws = new WebSocketLink({
      uri: `${environment.ws_url}/graphql`,
      options: {
        reconnect: true
      }
    });

    const link = split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      ws,
      http,
    ) as unknown as ApolloLink;

    apollo.create({
      link,
      cache: new InMemoryCache({
        typePolicies: {
          Bet: {
            keyFields: ['id'],
            fields: {
              teams: {
                merge(existing: Team[], incoming: Team[]) {
                  // optimization
                  if (!existing) {
                    return incoming;
                  }
                  return existing.map((team, index) => {
                    if (incoming.length > index) {
                      return {
                        name: team.name,
                        win: incoming[index].win
                      };
                    }
                    return team;
                  });
                }
              },
              draw: {
                merge(_: number, incoming: number) {
                  return incoming;
                }
              }
            }
          }
        }
      }),
    });
  }
}
