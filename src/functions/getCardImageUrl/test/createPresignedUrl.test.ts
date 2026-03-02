import {createPresignedUrl} from '../createPresignedUrl';

const GET_SIGNED_URL_MOCK = jest.fn();

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(),
  GetObjectCommand: jest.fn(),
}));
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest
    .fn()
    .mockImplementation((s3, command, options) =>
      GET_SIGNED_URL_MOCK(s3, command, options),
    ),
}));
jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

const MOCK_CARD_COLOUR = 'blue';
const MOCK_CARD_FILENAME = 'card.png';
const MOCK_URL = 'www.traab.com/blue-card.png';
const THIRTY_MINUTES_IN_SECONDS = 1800;
const TWENTY_FIVE_MINUTES_IN_MILLISECONDS = 1500000;

describe('getCard', () => {
  beforeEach(() => {
    jest.mocked(GET_SIGNED_URL_MOCK).mockResolvedValue(MOCK_URL);
  });

  it('should return presigned URL', async () => {
    const {presignedUrl} = await createPresignedUrl(
      MOCK_CARD_FILENAME,
      MOCK_CARD_COLOUR,
    );
    expect(presignedUrl).toEqual(MOCK_URL);
  });

  it('should return new expiry 25 minutes in the future', async () => {
    const {newExpiry} = await createPresignedUrl(
      MOCK_CARD_FILENAME,
      MOCK_CARD_COLOUR,
    );
    expect(newExpiry).toEqual(
      new Date(Date.now() + TWENTY_FIVE_MINUTES_IN_MILLISECONDS),
    );
  });

  it('should call getSignedUrl with expiry date in 30 minutes', async () => {
    await createPresignedUrl(MOCK_CARD_FILENAME, MOCK_CARD_COLOUR);

    const getSignedUrlCall = GET_SIGNED_URL_MOCK.mock.calls[0];
    const options = getSignedUrlCall[2];
    expect(options).toStrictEqual({expiresIn: THIRTY_MINUTES_IN_SECONDS});
  });
});
