const CLIENT_MOCK = {
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
};
jest.mock('../src/dao/client', () => ({
  getClient: jest.fn().mockImplementation(() => (CLIENT_MOCK)),
}));

export { CLIENT_MOCK };
