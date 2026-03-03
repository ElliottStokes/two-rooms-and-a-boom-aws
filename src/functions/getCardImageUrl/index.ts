import {getCardUrl, setCardUrl} from '../../dao';
import {createPresignedUrl} from './createPresignedUrl';

import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

async function handler({
  pathParameters,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!pathParameters || !pathParameters.cardId) {
    return {statusCode: 400, body: ''};
  }
  const {cardId} = pathParameters;
  const cardDetails = await getCardUrl(cardId);
  if (cardDetails === null) {
    return {
      statusCode: 404,
      headers: {'Content-Type': 'text/plain'},
      body: 'card not found',
    };
  }

  const {url, expiry, filename, colour} = cardDetails;
  if (url === null || expiry === null || expiry <= new Date(Date.now())) {
    const {presignedUrl, newExpiry} = await createPresignedUrl(
      filename,
      colour,
    );
    await setCardUrl(cardId, presignedUrl, newExpiry);
    return {
      statusCode: 200,
      headers: {'Content-Type': 'text/json'},
      body: JSON.stringify({url: presignedUrl}),
    };
  }
  return {
    statusCode: 200,
    headers: {'Content-Type': 'text/json'},
    body: JSON.stringify({url}),
  };
}

export {handler};
