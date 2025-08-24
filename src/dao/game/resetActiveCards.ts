import { getClient } from '../client';

async function resetActiveCards() {
  const client = await getClient();
  return await client.query('UPDATE two_rooms_and_a_boom.card SET isActive = FALSE WHERE isActive = TRUE AND isBasic = FALSE;');
}

export { resetActiveCards };
