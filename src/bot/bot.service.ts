import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class BotService {
  async downloadInstagram(link: string): Promise<string> {
    if (!link.includes('instagram.com/reel')) {
      throw new Error('❌ Reels link yuboring.');
    }

    const videoUrl = link;

    const downloadsDir = join(__dirname, '..', 'downloads');
    if (!existsSync(downloadsDir)) {
      mkdirSync(downloadsDir);
    }

    const fileName = `${randomUUID()}.mp4`;
    const filePath = join(downloadsDir, fileName);

    const writer = createWriteStream(filePath);
    const response = await axios.get(videoUrl, { responseType: 'stream' });
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return filePath;
  }
}
