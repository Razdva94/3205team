import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { Request } from 'express';

@Injectable()
export class ShortUrlService {
  constructor(private readonly prisma: PrismaService) {}

  async generateShortUrl(
    originalUrl: string,
    customAlias?: string,
    durationMinutes?: number,
  ): Promise<object> {
    const shortUrl = customAlias || randomBytes(3).toString('hex');
    const expiresAt = this.calculateExpiresAt(durationMinutes);
    const existingUrl = await this.prisma.shortUrl.findUnique({
      where: { shortUrl },
    });

    if (existingUrl) {
      throw new BadRequestException('Alias уже используется');
    }
    if (expiresAt) {
      const newUrl = await this.prisma.shortUrl.create({
        data: { originalUrl, shortUrl, expiresAt },
      });
      return {
        originalUrl: newUrl.originalUrl,
        shortUrl: newUrl.shortUrl,
        expiresAt,
      };
    } else {
      const newUrl = await this.prisma.shortUrl.create({
        data: { originalUrl, shortUrl },
      });
      return {
        originalUrl: newUrl.originalUrl,
        shortUrl: newUrl.shortUrl,
      };
    }
  }

  calculateExpiresAt(durationInMinutes: number): Date {
    if (durationInMinutes) {
      const now = new Date();
      const expirationTime = Number(durationInMinutes) * 60 * 1000;
      const expiresAt = new Date(now.getTime() + expirationTime);
      return expiresAt;
    } else {
      return null;
    }
  }
  async getOriginalUrl(shortUrl: string): Promise<string> {
    const urlData = await this.getInfo(shortUrl);
    const currentDate = new Date();
    if (urlData.expiresAt && currentDate >= urlData.expiresAt) {
      throw new HttpException('Срок действия ссылки истек.', HttpStatus.GONE);
    }
    return urlData.originalUrl;
  }

  async incrementClickCount(shortUrl: string): Promise<void> {
    await this.prisma.shortUrl.update({
      where: { shortUrl },
      data: { clickCount: { increment: 1 } },
    });
  }
  async saveIpInfo(shortUrl: string, req: Request): Promise<void> {
    const shortUrlEntry = await this.getInfo(shortUrl);
    await this.prisma.clickInfo.create({
      data: {
        ipAddress: req.ip,
        shortUrlId: shortUrlEntry.id,
      },
    });
  }

  async getAnalytics(shortUrl: string): Promise<object> {
    const urlData = await this.getInfo(shortUrl);

    const recentClicks = await this.prisma.clickInfo.findMany({
      take: 5,
      where: { shortUrlId: urlData.id },
      orderBy: { createdAt: 'desc' },
    });

    return { clickCount: urlData.clickCount, recentClicks };
  }

  async getInfo(shortUrl: string) {
    const urlData = await this.prisma.shortUrl.findUnique({
      where: { shortUrl },
    });
    if (!urlData) {
      throw new NotFoundException('Короткая ссылка не найдена');
    }
    return urlData;
  }

  async deleteInfo(shortUrl: string) {
    const urlData = await this.getInfo(shortUrl);
    await this.prisma.clickInfo.deleteMany({
      where: { shortUrlId: urlData.id },
    });
    await this.prisma.shortUrl.deleteMany({
      where: { id: urlData.id },
    });
  }
}
