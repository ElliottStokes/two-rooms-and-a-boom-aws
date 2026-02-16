import {getClient} from '../client';

type ActiveCard = {
  cardid: string;
  cardtitle: string;
  isbasic: boolean;
  teamid: string;
};

async function getActiveCards(): Promise<{
  basicCards: ActiveCard[];
  specialCards: ActiveCard[];
}> {
  const client = await getClient();
  const {rows: activeCards} = await client.query(
    'SELECT cardid, cardtitle, isbasic, teamid FROM two_rooms_and_a_boom.card WHERE isactive = TRUE;',
  );
  const basicCards: ActiveCard[] = [];
  const specialCards: ActiveCard[] = [];
  activeCards.forEach(card =>
    card.isbasic ? basicCards.push(card) : specialCards.push(card),
  );
  return {basicCards, specialCards};
}

export {getActiveCards};
