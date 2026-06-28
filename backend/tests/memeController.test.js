const MemeController = require('../controllers/memeController');
const AIService = require('../services-ia/aiService');
const ShareService = require('../services-ia/shareService');

// Mock services
jest.mock('../services-ia/aiService', () => ({
  generateMemeFromText: jest.fn().mockResolvedValue({
    topText: 'MOCK TOP',
    bottomText: 'MOCK BOTTOM',
    imageUrl: 'https://mock.img/text.jpg'
  }),
  generateMemeFromVoice: jest.fn().mockResolvedValue({
    topText: 'MOCK VOICE TOP',
    bottomText: 'MOCK VOICE BOTTOM',
    imageUrl: 'https://mock.img/voice.jpg'
  }),
  generateStatusRemix: jest.fn().mockResolvedValue({
    meme_text: 'MOCK STATUS TEXT',
    imageUrl: 'https://mock.img/status.jpg'
  }),
  chatWithCompanion: jest.fn().mockResolvedValue('Mock companion response'),
  generateImage: jest.fn().mockResolvedValue({
    imageUrl: 'https://mock.img/generated.jpg',
    description: 'Mock prompt description',
    provider: 'pollinations',
    fallback: false
  })
}));

jest.mock('../services-ia/shareService', () => ({
  buildShareBundle: jest.fn().mockResolvedValue({
    text: 'Share Text',
    publicUrl: 'https://share.url/test.jpg',
    shareId: 'testshare123',
    imageDataUrl: 'data:image/jpeg;base64,composed',
    hasImage: true
  })
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Meme Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate meme from text', async () => {
    const req = {
      body: { text: 'Some context idea', location: 'france' },
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000')
    };
    const res = mockResponse();

    await MemeController.createFromText(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const data = res.json.mock.calls[0][0];
    expect(data).toHaveProperty('topText', 'MOCK TOP');
    expect(data).toHaveProperty('companionComment');
  });

  it('should generate status remix', async () => {
    const req = {
      body: { text: 'remix text', inputImageUrl: 'https://my.image.jpg' },
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000')
    };
    const res = mockResponse();

    await MemeController.statusRemixer(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('should compose meme', async () => {
    const req = {
      body: { imageUrl: 'https://img.jpg', topText: 'T', bottomText: 'B' },
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000')
    };
    const res = mockResponse();

    await MemeController.compose(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle companion chat', async () => {
    const req = {
      body: { companionId: 'arch', message: 'Hello' }
    };
    const res = mockResponse();

    await MemeController.chat(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('reply', 'Mock companion response');
  });

  it('should handle getGreeting', async () => {
    const req = {
      body: { companionId: 'arch' }
    };
    const res = mockResponse();

    await MemeController.getGreeting(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('reply', 'Mock companion response');
  });

  it('should generate image', async () => {
    const req = {
      body: { prompt: 'A coding companion' }
    };
    const res = mockResponse();

    await MemeController.generateImage(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('imageUrl', 'https://mock.img/generated.jpg');
  });
});
