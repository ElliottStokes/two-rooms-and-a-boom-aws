import {getClient} from '../client';

async function getCardUrl(id: string): Promise<{
  url: string | null;
  expiry: Date | null;
  filename: string;
  colour: string;
} | null> {
  const client = await getClient();
  const {rowCount, rows} = await client.query(
    'SELECT c.url, c.urlexpiry, c.filename, t.colour ' +
      'FROM two_rooms_and_a_boom.card c ' +
      'LEFT JOIN two_rooms_and_a_boom.team t ON c.teamid = t.teamid ' +
      'WHERE c.cardid = $1',
    [id],
  );
  if (rowCount && rowCount > 0) {
    const {url, urlexpiry: expiry, filename, colour} = rows[0];
    return {url, expiry: new Date(expiry), filename, colour};
  }
  return null;
}

export {getCardUrl};
