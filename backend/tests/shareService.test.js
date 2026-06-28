const { buildShareBundle } = require('../services-ia/shareService');
const { applyMemeText } = require('../services-ia/providers/sticker');

jest.mock('../firebase', () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
  },
  admin: {
    firestore: {
      FieldValue: {
        increment: jest.fn().mockReturnValue(1),
      }
    }
  }
}));

jest.mock('../cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn((options, cb) => {
      const mockStream = {
        end: jest.fn(() => {
          cb(null, { secure_url: 'https://cloudinary/mocked-url.jpg' });
        })
      };
      return mockStream;
    })
  }
}));

jest.mock('../services-ia/providers/sticker', () => ({
  applyMemeText: jest.fn().mockResolvedValue({
    buffer: Buffer.from('mocked-buffer'),
    dataUrl: 'data:image/jpeg;base64,mocked-base64',
    base64: 'mocked-base64',
    provider: 'sharp-meme-text',
  })
}));

describe('Share Service Tests', () => {
  it('should successfully build share bundle and upload image', async () => {
    const res = await buildShareBundle({
      topText: 'TOP TEXT',
      bottomText: 'BOTTOM TEXT',
      imageBase64: 'data:image/jpeg;base64,mockedbase64',
      shareToForum: true,
      sourceMemeId: 'parent-meme-id'
    });

    expect(res).toHaveProperty('publicUrl', 'https://cloudinary/mocked-url.jpg');
    expect(res).toHaveProperty('imageDataUrl', 'data:image/jpeg;base64,mocked-base64');
    expect(res).toHaveProperty('shareId');
    expect(res.shareId.length).toBe(12);
  });
});
