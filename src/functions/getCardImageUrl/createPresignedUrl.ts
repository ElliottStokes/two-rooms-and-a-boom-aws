import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const S3 = new S3Client({region: 'eu-west-2'});
const BUCKET = 'two-rooms-and-a-boom';
const THIRTY_MINUTES_IN_SECONDS = 1800;
const TWENTY_FIVE_MINUTES_IN_MILLISECONDS = 1500000;

async function createPresignedUrl(filename: string, colour: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: `cards/${colour}/${filename}`,
  });

  const url = await getSignedUrl(S3, command, {
    expiresIn: THIRTY_MINUTES_IN_SECONDS,
  });
  return {
    presignedUrl: url,
    newExpiry: new Date(Date.now() + TWENTY_FIVE_MINUTES_IN_MILLISECONDS),
  };
}

export {createPresignedUrl};
