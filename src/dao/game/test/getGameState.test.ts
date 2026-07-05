import {getClient} from '../../client';
import {getGameState} from '../getGameState';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

describe('getGameState', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({
      rowCount: 1,
      rows: [{gamestate: 'WAITING_FOR_HOST'}],
    });
  });

  it('should call getClient function', async () => {
    await getGameState();
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with query', async () => {
    await getGameState();
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'SELECT gamestate FROM two_rooms_and_a_boom.gameState;',
    );
  });

  it('should return with game state', async () => {
    const gameState = await getGameState();
    expect(gameState).toBe('WAITING_FOR_HOST');
  });

  it('should return null when no rows are returned', async () => {
    CLIENT_MOCK.query.mockResolvedValue({rowCount: 0, rows: []});
    const gameState = await getGameState();
    expect(gameState).toBeNull();
  });

  it('should return null when an undefined value is returned', async () => {
    CLIENT_MOCK.query.mockResolvedValue({});
    const gameState = await getGameState();
    expect(gameState).toBeNull();
  });
});
