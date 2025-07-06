import { Module } from '@nestjs/common';
import { BotMenuController } from './botmenu.controller';
import { BotUpdate } from 'src/bot/bot.update';
import { BotService } from 'src/bot/bot.service';

@Module({
  providers: [BotUpdate, BotService],
  controllers: [BotMenuController],
})
export class BotMenuModule {}
