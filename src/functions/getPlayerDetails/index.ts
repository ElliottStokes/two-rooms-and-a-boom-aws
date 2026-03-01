import {getPlayerDetails} from '../../dao';

async function handler({
  requestContext: {
    http: {path},
  },
}: {
  requestContext: {http: {path: string}};
}) {
  const playerId = path.substring(path.lastIndexOf('/') + 1);
  const playerDetails = await getPlayerDetails(playerId);

  if (playerDetails === null) {
    return {statusCode: 404, body: 'Player does not exist'};
  }

  return {statusCode: 200, body: playerDetails};
}

export {handler};
