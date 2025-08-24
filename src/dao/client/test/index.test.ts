import { DsqlSigner } from "@aws-sdk/dsql-signer";
import { getClient } from "..";
import { Client } from "pg";

const MOCK_SIGNER = {
  getDbConnectAdminAuthToken: jest.fn().mockResolvedValue('MOCK_TOKEN'),
};
jest.mock('@aws-sdk/dsql-signer', () => ({
  DsqlSigner: jest.fn().mockImplementation(() => MOCK_SIGNER),
}));
const MOCK_CLIENT = { connect: jest.fn() };
jest.mock('pg', () => ({
  Client: jest.fn().mockImplementation(() => MOCK_CLIENT),
}));

const AWS_REGION = process.env.AWS_REGION ?? '';
const DSQL_CLUSTER_ENDPOINT = process.env.DSQL_CLUSTER_ENDPOINT ?? '';

describe('client', () => {
  test('should instantiate client on first call', async () => {
    await getClient();
    expect(DsqlSigner).toHaveBeenCalledWith({
      hostname: DSQL_CLUSTER_ENDPOINT,
      region: AWS_REGION,
    })
    expect(Client).toHaveBeenCalledWith({
      host: DSQL_CLUSTER_ENDPOINT,
      user: 'admin',
      password: 'MOCK_TOKEN',
      database: 'postgres',
      port: 5432,
      ssl: true,
    });

    await getClient();
    expect(MOCK_SIGNER.getDbConnectAdminAuthToken).toHaveBeenCalledTimes(1);
    expect(MOCK_CLIENT.connect).toHaveBeenCalledTimes(1);
  });
});
