import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { BotMenuModule } from './botmenu/botmenu.module';

@Module({
  imports: [BotModule, BotMenuModule],
})
export class AppModule {}
