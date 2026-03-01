# two-rooms-and-a-boom-aws

## Recommended database deployment:

**AWS Aurora DSQL**

Clusters > Create cluster > Single-Region

name: `two-rooms-and-a-boom-dsql-cluster`

## AWS CLI

DSQL dev cluster:

```
aws dsql create-cluster --no-deletion-protection-enabled --region eu-west-2 --tags Name=two-rooms-and-a-boom-dsql-cluster
```

## Testing

### Postgres scripts
Check active cards:
```
SELECT * FROM two_rooms_and_a_boom.card WHERE isactive = TRUE;
```