import {getClient} from '../client';

import type {Card} from '../../types';

const BASIC_CARDS = ['Red Team', 'Blue Team'];

async function getActiveCards(): Promise<{
  basicCards: Card[];
  uniqueCards: Card[];
}> {
  const client = await getClient();
  const {rows} = await client.query(
    'SELECT cardid as id, cardtitle as title, teamid as teamId FROM two_rooms_and_a_boom.card WHERE isactive = TRUE;',
  );
  const activeCards: Card[] = rows;
  const basicCards: Card[] = [];
  const uniqueCards: Card[] = [];
  activeCards.forEach(card =>
    BASIC_CARDS.includes(card.title)
      ? basicCards.push(card)
      : uniqueCards.push(card),
  );
  return {basicCards, uniqueCards};
}

export {getActiveCards};
