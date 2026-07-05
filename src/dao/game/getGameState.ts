import {getClient} from '../client';

import type {GameState} from '../../types';

async function getGameState(): Promise<GameState | null> {
  const client = await getClient();
  const result = await client.query(
    'SELECT gamestate FROM two_rooms_and_a_boom.gameState;',
  );
  if (result.rowCount && result.rowCount > 0) {
    return result.rows[0].gamestate;
  }
  return null;
}

export {getGameState};
