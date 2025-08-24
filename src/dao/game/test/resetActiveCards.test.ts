import { CLIENT_MOCK } from '../../../../testUtils';
import { getClient } from '../../client';
import { resetActiveCards } from '../resetActiveCards';

describe('resetActiveCards', () => {
  it('should call getClient function', async () => {
    await resetActiveCards();
    expect(getClient).toHaveBeenCalled();
  });

  it('should call Client with query function', async () => {
    await resetActiveCards();
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'UPDATE two_rooms_and_a_boom.card SET isActive = FALSE WHERE isActive = TRUE AND isBasic = FALSE;'
    );
  });
});