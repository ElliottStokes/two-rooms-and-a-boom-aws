# two-rooms-and-a-boom-aws
AWS backend instance of the card game Two Rooms and a Boom by Alan Gerding and Sean Mccoy. Created with the Creative Commons license BY–NC–SA 4.0

AWS deployment: CDK 2.201.0

Lambdas: TypeScript ~5.6.3

## Deployment

### Prerequisites
* run `cdk bootstrap` to bootstrap your AWS account
* Need to export values in the environment variable in order to deploy
  * DSQL_CLUSTER_ID: found on AWS console, go to Aurora DSQL > Clusters and copy Cluster ID
  * DSQL_CLUSTER_ENDPOINT: found on AWS console, go to Aurora DSQL > Clusters and copy Endpoint

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
