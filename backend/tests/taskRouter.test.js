const { runText, runImage, runAudio } = require('../services-ia/taskRouter');

describe('Task Router Fallback Chain Tests', () => {
  it('should run successful call function without triggering fallback chain', async () => {
    const mockCall = jest.fn(async (fn) => {
      return 'success';
    });

    const res = await runText(mockCall, 'fallback');
    expect(res).toBe('success');
  });

  it('should return fallback when all router functions fail', async () => {
    const mockCall = jest.fn(async (fn) => {
      throw new Error('fail');
    });

    const res = await runText(mockCall, 'fallback-value');
    expect(res).toBe('fallback-value');
  });

  it('should throw error when all router functions fail and no fallback is set', async () => {
    const mockCall = jest.fn(async (fn) => {
      throw new Error('critical-fail');
    });

    await expect(runText(mockCall, null)).rejects.toThrow();
  });
});
