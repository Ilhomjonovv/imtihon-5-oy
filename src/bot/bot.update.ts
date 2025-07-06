import {
  Update,
  Start,
  Ctx,
  Hears,
  Command,
  Action,
  On,
} from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { BotService } from './bot.service';
import axios from 'axios';
import { MyContext } from './bot.context';
import { CustomContext } from './context.interface';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: MyContext) {
    await ctx.reply(
      `🔥 Assalomu alaykum. @Instaa_Savedbot ga Xush kelibsiz. Bot orqali quyidagilarni yuklab olishingiz mumkin:

• Instagram - post va reels + audio bilan;
• You Tube - shorts `,
      Markup.keyboard([['Qoshiqni qidirish']]).resize(),
    );
  }

  @Hears('Qoshiqni qidirish')
  async searchMusic(@Ctx() ctx: CustomContext) {
    ctx.reply('qoshiq nomini kiriting:');
    ctx.session.qoshiq = 'qoshiq';
  }

  @Hears(/instagram\.com\/reel/)
  async onText(@Ctx() ctx: Context) {
    const message = ctx.message as { text?: string };
    const text = message?.text;

    if (!text || !text.includes('instagram.com/reel')) {
      await ctx.reply('📎 Iltimos, Reels link yuboring.');
      return;
    }

    await ctx.reply('📥 Video yuklab olinmoqda...');

    try {
      const filePath = await this.botService.downloadInstagram(text);
      await ctx.replyWithVideo({ source: filePath });
    } catch (err) {
      console.error('Yuklashda xato:', err);
      await ctx.reply('❌ Video yuklab bo‘lmadi.');
    }
  }
  
  @Command('top')
  async onTop(@Ctx() ctx: MyContext) {
    const res = await axios.get('https://api.deezer.com/search?q=Ozbekiston');
    const tracks = res.data.data.slice(0, 10);

    ctx.session ??= { tracks: [] };
    ctx.session.tracks = tracks;

    const buttons = tracks.map((track, index) => [
      Markup.button.callback(
        `${track.title} - ${track.artist.name}`,
        `track_${index}`,
      ),
    ]);

    await ctx.reply(
      '🎵 Uzbekistondagi Top qo‘shiqlar:',
      Markup.inlineKeyboard(buttons),
    );
  }

  @Action(/track_\d+/)
  async onTrack(@Ctx() ctx: MyContext) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
      await ctx.reply('Button malumotlari topilmadi.');
      return
    }

    const data = ctx.callbackQuery.data;
    const index = Number(data.split('_')[1]);

    if (!ctx.session?.tracks?.[index]) {
      await ctx.reply('Qoshiq topilmadi');
      return
    }

    const track = ctx.session.tracks[index];

    await ctx.answerCbQuery();
    await ctx.replyWithAudio(
      { url: track.preview },
      {
        caption: `${track.title} - ${track.artist.name}`,
      },
    );
  }

  @Command('help')
  async help(@Ctx() ctx: MyContext) {
    await ctx.reply(
      `❕ Sizga yordam kerakmi?

☎️ Qo'llab-quvvatlash xizmati orqali bot haqidagi istalgan savolingizga javob topishingiz mumkin!`,
      Markup.inlineKeyboard([
        [
          Markup.button.url(
            '☎️ Qollab-Quvvatlash',
            'https://t.me/xojiakbar2270',
          ),
        ],
      ]),
    );
  }

  @Command('lang')
  async onLangCommand(@Ctx() ctx: CustomContext) {
    const lang = ctx.session?.language || 'oz';
    await ctx.reply('🌍 Tilni tanlang', this.langKeyboard(lang));
  }
  @Action(['oz', 'ru', 'en'])
  async onLangSelect(@Ctx() ctx: any) {
    const selectedLang = ctx.match[0];
    ctx.session.language = selectedLang;

    const langs = {
      oz: "🇺🇿 Bot tili O'zbekcha ga o'zgartirildi ✅",
      ru: '🇷🇺 Язык бота изменён на Русский ✅',
      en: '🇺🇸 Bot language changed to English ✅',
    };

    await ctx.editMessageReplyMarkup(
      this.langKeyboard(selectedLang).reply_markup,
    );
    await ctx.answerCbQuery(langs[selectedLang], { show_alert: true });
  }

  private langKeyboard(current: string) {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          current === 'oz' ? "🇺🇿 O'zbekcha ✅" : "🇺🇿 O'zbekcha",
          'oz',
        ),
      ],
      [
        Markup.button.callback(
          current === 'ru' ? '🇷🇺 Русский ✅' : '🇷🇺 Русский',
          'ru',
        ),
        Markup.button.callback(
          current === 'en' ? '🇺🇸 English ✅' : '🇺🇸 English',
          'en',
        ),
      ],
    ]);
  }

  @On('text')
  async ontext(@Ctx() ctx: MyContext) {
    if (ctx.message && 'text' in ctx.message) {
      const qoshiqNomi = ctx.message.text;
      const res = await axios.get(
        `https://api.deezer.com/search?q=${qoshiqNomi}`,
      );
      const tracks = res.data.data.slice(0, 10);

      ctx.session ??= { tracks: [] };
      ctx.session.tracks = tracks;

      const buttons = tracks.map((track, index) => [
        Markup.button.callback(
          `${track.title} - ${track.artist.name}`,
          `track_${index}`,
        ),
      ]);

      await ctx.reply(
        '🎵 Siz qidirgan qo‘shiqlar:',
        Markup.inlineKeyboard(buttons),
      );
    }
  }
}
