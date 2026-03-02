import {getCardUrl, setCardUrl} from '../../dao';
import {createPresignedUrl} from './createPresignedUrl';

async function handler({
  requestContext: {
    http: {path},
  },
}: {
  requestContext: {http: {path: string}};
}) {
  const cardId = path.substring(path.lastIndexOf('/') + 1);
  const cardDetails = await getCardUrl(cardId);
  if (cardDetails === null) {
    return {statusCode: 404, body: 'card not found'};
  }

  const {url, expiry, filename, colour} = cardDetails;
  if (url === null || expiry === null || expiry <= new Date(Date.now())) {
    const {presignedUrl, newExpiry} = await createPresignedUrl(
      filename,
      colour,
    );
    await setCardUrl(cardId, presignedUrl, newExpiry);
    return {statusCode: 200, body: {url: presignedUrl}};
  }
  return {statusCode: 200, body: {url}};
}

export {handler};
