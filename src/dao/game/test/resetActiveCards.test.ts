import { getClient } from "../../client";
import { resetActiveCards } from "../resetActiveCards";

const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../../client', () => ({
  getClient: jest.fn().mockImplementation(() => (CLIENT_MOCK))
}));

describe('resetActiveCards', () => {
  test('should call getClient function', async () => {
    await resetActiveCards();
    expect(getClient).toHaveBeenCalled();
  });

  test('should call Client with query function', async () => {
    await resetActiveCards();
    expect(CLIENT_MOCK.query).toHaveBeenCalledWith(
      'UPDATE two_rooms_and_a_boom.card SET isActive = FALSE WHERE isActive = TRUE AND isBasic = FALSE;'
    );
  });
});