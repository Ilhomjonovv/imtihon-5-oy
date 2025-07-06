// src/bot/context.interface.ts
import { Context } from 'telegraf';

export interface SessionData {
  language?: 'oz' | 'ru' | 'en';
  qoshiq: string | null;
}

export interface CustomContext extends Context {
  session: SessionData;
}
