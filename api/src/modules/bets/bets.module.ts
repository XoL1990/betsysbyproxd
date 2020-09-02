import { Module, HttpModule } from '@nestjs/common';
import { BetsResolver } from './resolvers/bets.resolver';
import { BetsService } from './services/bets.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    GraphQLModule.forRootAsync({
      imports: [BetsModule],
      useFactory: (betsSerice: BetsService) => ({
        autoSchemaFile: 'schema.gql',
        debug: !process.env.PROD,
        playground: !process.env.PROD,
        installSubscriptionHandlers: true,
        subscriptions: {
          onConnect: async (connectionParams: any, ws, ctx) => {
            betsSerice.onConnect();
          },
          onDisconnect: (ws, ctx) => {
            betsSerice.onDisconnect();
          },
          keepAlive: 10000
        }
      }),
      inject: [BetsService]
    })
  ],
  providers: [BetsService, BetsResolver],
  exports: [BetsService]
})
export class BetsModule {

}
