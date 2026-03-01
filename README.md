# two-rooms-and-a-boom-aws
AWS backend instance of the card game Two Rooms and a Boom by Alan Gerding and Sean Mccoy. Created with the Creative Commons license BY–NC–SA 4.0

AWS deployment: CDK 2.201.0

Lambdas: TypeScript ~5.6.3

node: 22.x

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Deployment

### Prerequisites

requires `aws-cdk` to be installed:
```
npm install -g aws-cdk
```

When deploying to a completely new project to an AWS account, run `cdk bootstrap` to bootstrap your AWS account.

DSQL database can be deployed using [DB docs](./db/README.md)

Need to export values in the environment variable in order to deploy
  * **AWS_ACCOUNT_ID**: found in the AWS console at the top right of the page
  * **AWS_REGION**: AWS region you would like to deploy to
  * **DSQL_CLUSTER_ID**: found on AWS CLI using command `aws dsql list-clusters` or AWS console, go to Aurora DSQL > Clusters and copy Cluster ID
  * **DSQL_CLUSTER_ENDPOINT**: created using the cluster ID followed by `.dsql.eu-west-2.on.aws` or found on AWS console, go to Aurora DSQL > Clusters and copy Endpoint

Create a .env file and store the values in a key value pair (e.g. `AWS_REGION=eu-west-2`). Then run the following command:
```
export $(cat .env | xargs)
```

---

### Commands

To deploy run:
```
npm run deploy
```

To deploy with hot refresh run:
```
npm run watch
```

To delete the stack run:
```
npm run delete
```

## Testing

### Postgres scripts
Check active cards:
```
SELECT * FROM two_rooms_and_a_boom.card WHERE isactive = TRUE;
```
