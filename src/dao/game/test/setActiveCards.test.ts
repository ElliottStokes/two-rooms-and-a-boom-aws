import { CLIENT_MOCK } from '../../../../testUtils';
import { getClient } from '../../client';
import { setActiveCards } from '../setActiveCards';

const MOCK_ACTIVE_CARD_NAMES = ['cardOne', 'cardTwo', 'cardThree'];

describe('setActiveCards', () => {
  it('should call getClient function', async () => {
    await setActiveCards(MOCK_ACTIVE_CARD_NAMES);
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with query function', async () => {
    await setActiveCards(MOCK_ACTIVE_CARD_NAMES);
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      "UPDATE two_rooms_and_a_boom.card SET isactive = TRUE WHERE cardtitle IN ('cardOne', 'cardTwo', 'cardThree');"
    );
  });

  it('should not call getClient function if empty string passed in', async () => {
    await setActiveCards([]);
    expect(getClient).not.toHaveBeenCalled();
  });

  it('should not call Client query function if empty string passed in', async () => {
    await setActiveCards([]);
    expect(CLIENT_MOCK.query).not.toHaveBeenCalled();
  });
});