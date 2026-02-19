import {getClient} from '../client';

type ActiveCard = {
  cardid: string;
  cardtitle: string;
  teamid: string;
};

const BASIC_CARDS = ['Red Team', 'Blue Team'];

async function getActiveCards(): Promise<{
  basicCards: ActiveCard[];
  uniqueCards: ActiveCard[];
}> {
  const client = await getClient();
  const {rows: activeCards} = await client.query(
    'SELECT cardid, cardtitle, teamid FROM two_rooms_and_a_boom.card WHERE isactive = TRUE;',
  );
  const basicCards: ActiveCard[] = [];
  const uniqueCards: ActiveCard[] = [];
  activeCards.forEach(card =>
    BASIC_CARDS.includes(card.cardtitle)
      ? basicCards.push(card)
      : uniqueCards.push(card),
  );
  return {basicCards, uniqueCards};
}

export {getActiveCards};
