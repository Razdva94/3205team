import { Test, TestingModule } from '@nestjs/testing';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('ShortUrlController', () => {
  let controller: ShortUrlController;
  let service: ShortUrlService;

  const mockShortUrlService = {
    generateShortUrl: jest.fn(),
    getOriginalUrl: jest.fn(),
    getAnalytics: jest.fn(),
    deleteInfo: jest.fn(),
    saveIpInfo: jest.fn(),
    incrementClickCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortUrlController],
      providers: [
        {
          provide: ShortUrlService,
          useValue: mockShortUrlService,
        },
      ],
    }).compile();

    controller = module.get<ShortUrlController>(ShortUrlController);
    service = module.get<ShortUrlService>(ShortUrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('должен успешно создать короткую ссылку', async () => {
      const dto = {
        originalUrl: 'https://example.com',
        customAlias: 'custom123',
        durationMinutes: 22,
      };
      const expectedResult = {
        originalUrl: 'https://example.com',
        shortUrl: 'custom123',
        expieresAt: '2025-01-09 18:02:29.436',
      };

      mockShortUrlService.generateShortUrl.mockResolvedValue(expectedResult);

      const result = await controller.createShortUrl(dto);
      expect(result).toEqual(expectedResult);
      expect(service.generateShortUrl).toHaveBeenCalledWith(
        dto.originalUrl,
        dto.customAlias,
        Number(dto.durationMinutes),
      );
    });

    it('должен выбросить ошибку, если алиас уже существует', async () => {
      const dto = {
        originalUrl: 'https://example.com',
        customAlias: 'custom123',
      };

      mockShortUrlService.generateShortUrl.mockRejectedValue(
        new BadRequestException('Alias уже используется'),
      );

      await expect(controller.createShortUrl(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('redirectToOriginalUrl', () => {
    let mockRes: Partial<Response>;

    beforeEach(() => {
      mockRes = {
        redirect: jest.fn().mockReturnThis(), // Метод должен возвращать сам объект Response
      };
    });

    it('должен выполнить редирект на оригинальный URL', async () => {
      const shortUrl = 'abc123';
      const expectedUrl = 'https://example.com';
      const mockReq = { ip: '127.0.0.1' } as any;

      mockShortUrlService.getOriginalUrl.mockResolvedValue(expectedUrl);

      await controller.redirectToOriginUrl(
        shortUrl,
        mockReq,
        mockRes as Response,
      );

      expect(mockRes.redirect).toHaveBeenCalledWith(expectedUrl);
      expect(service.getOriginalUrl).toHaveBeenCalledWith(shortUrl);
    });

    it('должен выбросить ошибку, если короткая ссылка не найдена', async () => {
      const shortUrl = 'abc123';
      const mockReq = { ip: '127.0.0.1' } as any;
      mockShortUrlService.getOriginalUrl.mockRejectedValue(
        new NotFoundException('Ссылка не найдена'),
      );

      await expect(
        controller.redirectToOriginUrl(shortUrl, mockReq, mockRes as Response),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAnalytics', () => {
    it('должен вернуть аналитику по короткой ссылке', async () => {
      const shortUrl = 'abc123';
      const analytics = {
        clickCount: 5,
        recentClicks: [{ ipAddress: '192.168.1.1' }],
      };

      mockShortUrlService.getAnalytics.mockResolvedValue(analytics);

      const result = await controller.getAnalytics(shortUrl);
      expect(result).toEqual(analytics);
      expect(service.getAnalytics).toHaveBeenCalledWith(shortUrl);
    });
  });

  describe('deleteShortUrl', () => {
    it('должен успешно удалить короткую ссылку', async () => {
      const shortUrl = 'abc123';

      mockShortUrlService.deleteInfo.mockResolvedValue(undefined);

      const result = await controller.deleteUrl(shortUrl);
      expect(result).toBeUndefined();
      expect(service.deleteInfo).toHaveBeenCalledWith(shortUrl);
    });
  });
});
