import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  Delete,
  Res,
} from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { ShortenUrlDto } from './dto/create-shortUrl.dto';
import { Request, Response } from 'express';

@Controller('short-url')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Post('shorten')
  async createShortUrl(@Body() body: ShortenUrlDto) {
    const { originalUrl, customAlias, durationMinutes } = body;
    const shortUrl = await this.shortUrlService.generateShortUrl(
      originalUrl,
      customAlias,
      Number(durationMinutes),
    );
    return shortUrl;
  }

  @Get(':shortUrl')
  async redirectToOriginUrl(
    @Param('shortUrl') shortUrl: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const originalUrl = await this.shortUrlService.getOriginalUrl(shortUrl);
    await this.shortUrlService.saveIpInfo(shortUrl, req);

    return res.redirect(originalUrl);
  }
  @Get('/analytics/:shortUrl')
  async getAnalytics(@Param('shortUrl') shortUrl: string) {
    return await this.shortUrlService.getAnalytics(shortUrl);
  }
  @Get('info/:shortUrl')
  async getInfo(@Param('shortUrl') shortUrl: string) {
    return await this.shortUrlService.getInfo(shortUrl);
  }

  @Delete('/delete/:shortUrl')
  async deleteUrl(@Param('shortUrl') shortUrl: string) {
    return await this.shortUrlService.deleteInfo(shortUrl);
  }
}
