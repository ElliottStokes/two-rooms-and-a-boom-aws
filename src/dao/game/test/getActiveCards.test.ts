import {getClient} from '../../client';
import {getActiveCards} from '../getActiveCards';

import {Card} from '../../../types';

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => CLIENT_MOCK),
}));

const MOCK_ROWS: Card[] = [
  {id: 'abc-123', title: 'Blue Team', teamId: 'team-1'},
  {id: 'def-456', title: 'test-card-2', teamId: 'team-1'},
  {id: 'ghi-789', title: 'test-card-3', teamId: 'team-2'},
  {id: 'jkl-135', title: 'Red Team', teamId: 'team-2'},
];

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
      'SELECT cardid as id, cardtitle as title, teamid as teamId FROM two_rooms_and_a_boom.card WHERE isactive = TRUE;',
    );
  });

  describe('when returning cards from the DB', () => {
    beforeEach(() => {
      CLIENT_MOCK.query.mockResolvedValue({rows: MOCK_ROWS});
    });

    it('should put basic cards into basicCards prop', async () => {
      const {basicCards} = await getActiveCards();
      expect(basicCards).toStrictEqual([
        {id: 'abc-123', title: 'Blue Team', teamId: 'team-1'},
        {id: 'jkl-135', title: 'Red Team', teamId: 'team-2'},
      ]);
    });

    it('should put unique cards into uniqueCards prop', async () => {
      const {uniqueCards} = await getActiveCards();
      expect(uniqueCards).toStrictEqual([
        {id: 'def-456', title: 'test-card-2', teamId: 'team-1'},
        {id: 'ghi-789', title: 'test-card-3', teamId: 'team-2'},
      ]);
    });
  });
});
