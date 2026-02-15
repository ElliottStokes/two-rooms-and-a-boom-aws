import {getClient} from '../client';

async function setActiveCards(activeCardNames: string[]) {
  if (activeCardNames.length === 0) {
    return Promise.resolve();
  }

  const client = await getClient();
  const activeCardNamesQueryString = activeCardNames
    .map(name => `'${name}'`)
    .join(', ');
  return await client.query(
    `UPDATE two_rooms_and_a_boom.card SET isactive = TRUE WHERE cardtitle IN (${activeCardNamesQueryString});`,
  );
}

export {setActiveCards};
