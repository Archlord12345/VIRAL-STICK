const ForumController = require('../controllers/forumController');
const { db } = require('../firebase');

// Mock firebase
jest.mock('../firebase', () => {
  const mockGet = jest.fn().mockResolvedValue({
    exists: true,
    data: () => ({
      shareId: 'test-id',
      imageUrl: 'https://img.jpg',
      topText: 'A',
      bottomText: 'B',
      likes: 10,
      remixes: 2,
      createdAt: 1234567,
      userId: 'user-1',
      username: 'User 1'
    })
  });

  const mockDocs = [
    {
      id: 'doc-1',
      data: () => ({
        shareId: 'doc-1',
        imageUrl: 'https://img1.jpg',
        topText: 'A1',
        bottomText: 'B1',
        likes: 5,
        remixes: 1,
        createdAt: 1111111,
        userId: 'user-1',
        username: 'User 1'
      })
    }
  ];

  const mockLimitGet = jest.fn().mockResolvedValue({
    docs: mockDocs,
    forEach: (cb) => mockDocs.forEach(cb)
  });

  const mockDb = {
    collection: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    get: mockLimitGet,
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    runTransaction: jest.fn(async (cb) => {
      return cb({
        get: mockGet,
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      });
    })
  };

  return {
    db: mockDb,
    admin: {
      firestore: {
        FieldValue: {
          increment: jest.fn().mockReturnValue(1)
        }
      }
    }
  };
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Forum Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should publish a meme and respond success', async () => {
    const req = {
      body: {
        shareId: 'test-publish-id',
        imageUrl: 'https://test-publish.jpg',
        topText: 'Publish Top',
        bottomText: 'Publish Bottom',
        userId: 'user-123',
        username: 'Creator'
      }
    };
    const res = mockResponse();

    // Force isDbUsable to false/true or let it run
    await ForumController.publishMeme(req, res);
    expect(res.json).toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData).toHaveProperty('success', true);
  });

  it('should retrieve memes with getMemes', async () => {
    const req = {
      query: {
        sortBy: 'createdAt',
        userId: 'user-123'
      }
    };
    const res = mockResponse();

    await ForumController.getMemes(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it('should successfully toggle like on a meme', async () => {
    const req = {
      params: { id: 'meme-123' },
      body: { userId: 'user-123' }
    };
    const res = mockResponse();

    await ForumController.likeMeme(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]).toHaveProperty('success', true);
  });

  it('should retrieve leaderboard stats', async () => {
    const req = {};
    const res = mockResponse();

    await ForumController.getLeaderboard(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(Array.isArray(res.json.mock.calls[0][0])).toBe(true);
  });
});
