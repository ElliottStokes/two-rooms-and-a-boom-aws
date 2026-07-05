import {getClient} from '../client';

import type {GameState} from '../../types';

async function getGameState(): Promise<{
  gameState: GameState;
  revealTime: Date | null;
} | null> {
  const client = await getClient();
  const result = await client.query(
    'SELECT gamestate, matchendtime FROM two_rooms_and_a_boom.gameState;',
  );
  if (result.rowCount && result.rowCount > 0) {
    return {
      gameState: result.rows[0].gamestate,
      revealTime: result.rows[0].matchendtime,
    };
  }
  return null;
}

export {getGameState};
