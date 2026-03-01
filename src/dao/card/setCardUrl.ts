import {getClient} from '../client';

async function setCardUrl(cardId: string, url: string, expiry: Date) {
  const client = await getClient();
  await client.query(
    'UPDATE two_rooms_and_a_boom.card SET url = $2, urlexpiry = $3 WHERE cardid = $1;',
    [cardId, url, expiry],
  );
  return;
}

export {setCardUrl};
