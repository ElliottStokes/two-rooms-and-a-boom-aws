import {getClient} from '../../client';
import {getActiveCards} from '../getActiveCards';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

describe('getActiveCards', () => {
  beforeEach(() => {
    CLIENT_MOCK.query.mockResolvedValue({rows: []});
  });

  it('should call getClient function', async () => {
    await getActiveCards();
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with query function', async () => {
    await getActiveCards();
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'SELECT cardid, cardtitle, isbasic, teamid FROM two_rooms_and_a_boom.card WHERE isactive = TRUE;',
    );
  });

  describe('when returning cards from the DB', () => {
    beforeEach(() => {
      CLIENT_MOCK.query.mockResolvedValue({
        rows: [
          {
            cardid: 'abc-123',
            cardtitle: 'test-card-1',
            teamid: 'team-1',
            isbasic: true,
          },
          {
            cardid: 'def-456',
            cardtitle: 'test-card-2',
            teamid: 'team-1',
            isbasic: false,
          },
          {
            cardid: 'ghi-789',
            cardtitle: 'test-card-3',
            teamid: 'team-2',
            isbasic: false,
          },
          {
            cardid: 'jkl-135',
            cardtitle: 'test-card-4',
            teamid: 'team-2',
            isbasic: true,
          },
        ],
      });
    });

    it('should put basic cards into basicCards prop', async () => {
      const {basicCards} = await getActiveCards();
      expect(basicCards).toStrictEqual([
        {
          cardid: 'abc-123',
          cardtitle: 'test-card-1',
          teamid: 'team-1',
          isbasic: true,
        },
        {
          cardid: 'jkl-135',
          cardtitle: 'test-card-4',
          teamid: 'team-2',
          isbasic: true,
        },
      ]);
    });

    it('should put special cards into specialCards prop', async () => {
      const {specialCards} = await getActiveCards();
      expect(specialCards).toStrictEqual([
        {
          cardid: 'def-456',
          cardtitle: 'test-card-2',
          teamid: 'team-1',
          isbasic: false,
        },
        {
          cardid: 'ghi-789',
          cardtitle: 'test-card-3',
          teamid: 'team-2',
          isbasic: false,
        },
      ]);
    });
  });
});
