import { Context as TelegrafContext } from 'telegraf';

export interface MyContext extends TelegrafContext {
  session: {
    tracks: {
      title: string;
      preview: string;
      artist: { name: string };
    }[];
    page?: number | undefined;
  };
}
