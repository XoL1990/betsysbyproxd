import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BetsModule } from './modules/bets/bets.module';

@Module({
  imports: [BetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
