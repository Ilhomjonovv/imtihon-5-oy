import { Controller, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Controller()
export class BotMenuController implements OnModuleInit {
  constructor(@InjectBot() private readonly Bot: Telegraf) {}

  async onModuleInit() {
    await this.Bot.telegram.setMyCommands([
      { command: '/start', description: 'start' },
      { command: '/top', description: 'Top Popular Songs' },
      { command: '/lang', description: 'Choose a language' },
      { command: '/help', description: 'Contact admin' },
    ]);
  }
}
