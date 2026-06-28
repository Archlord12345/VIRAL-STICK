const { applyMemeText, exportSticker, compositeSticker, addFaceToSticker } = require('../services-ia/providers/sticker');

jest.mock('sharp', () => {
  const mSharp = {
    metadata: jest.fn().mockResolvedValue({ width: 1000, height: 1000 }),
    resize: jest.fn().mockReturnThis(),
    png: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    composite: jest.fn().mockReturnThis(),
    ensureAlpha: jest.fn().mockReturnThis(),
    trim: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('mocked-buffer')),
  };
  return jest.fn(() => mSharp);
});

describe('Sticker Provider Tests', () => {
  it('should apply meme text and return the correct structure', async () => {
    const res = await applyMemeText(Buffer.from('input'), { topText: 'TOP', bottomText: 'BOTTOM' });
    expect(res).toHaveProperty('buffer');
    expect(res).toHaveProperty('dataUrl');
    expect(res).toHaveProperty('base64');
    expect(res).toHaveProperty('provider', 'sharp-meme-text');
    expect(res).toHaveProperty('width', 1000);
    expect(res).toHaveProperty('height', 1000);
  });

  it('should export sticker correctly', async () => {
    const res = await exportSticker(Buffer.from('input'), { size: 512, doRemoveBackground: false });
    expect(res).toHaveProperty('buffer');
    expect(res).toHaveProperty('dataUrl');
    expect(res).toHaveProperty('width', 512);
    expect(res).toHaveProperty('provider', 'sticker-processor');
  });

  it('should composite sticker onto a photo', async () => {
    const res = await compositeSticker(Buffer.from('photo'), Buffer.from('sticker'), {
      position: 'center',
      scale: 0.5,
    });
    expect(res).toHaveProperty('buffer');
    expect(res).toHaveProperty('dataUrl');
    expect(res).toHaveProperty('stickerPosition');
    expect(res.stickerPosition).toHaveProperty('width');
    expect(res.stickerPosition).toHaveProperty('height');
    expect(res).toHaveProperty('provider', 'sharp-composite');
  });

  it('should swap face onto a sticker', async () => {
    const res = await addFaceToSticker(Buffer.from('sticker'), Buffer.from('face'), {
      outputSize: 256,
      faceRegionX: 0.1,
      faceRegionY: 0.1,
      faceRegionW: 0.8,
      faceRegionH: 0.8,
    });
    expect(res).toHaveProperty('buffer');
    expect(res).toHaveProperty('dataUrl');
    expect(res).toHaveProperty('faceRegion');
    expect(res).toHaveProperty('provider', 'sharp-face-swap');
  });
});
