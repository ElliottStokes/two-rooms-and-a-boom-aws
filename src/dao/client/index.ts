import { DsqlSigner } from '@aws-sdk/dsql-signer';
import { Client } from 'pg';

const AWS_REGION = process.env.AWS_REGION ?? '';
const DSQL_CLUSTER_ENDPOINT = process.env.DSQL_CLUSTER_ENDPOINT ?? '';

let client: Client;

async function getClient() {
  if (!client) {
    const signer = new DsqlSigner({
      hostname: DSQL_CLUSTER_ENDPOINT,
      region: AWS_REGION
    });
    const token = await signer.getDbConnectAdminAuthToken();
    client = new Client({
      host: DSQL_CLUSTER_ENDPOINT,
      user: 'admin',
      password: token,
      database: 'postgres',
      port: 5432,
      ssl: true,
    });
    await client.connect();
  }
  return client;
}

export { getClient };
