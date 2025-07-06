import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { session } from 'telegraf';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '7582164276:AAG-FFlrdFaFFCfsU-c0a2TWSl7ZsLZhvXw',
      middlewares: [session()]
    }),
  ],
  providers: [BotService, BotUpdate],
})
export class BotModule {}
