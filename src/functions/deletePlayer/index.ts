import {deletePlayer} from '../../dao';

async function handler({
  requestContext: {
    http: {path},
  },
}: {
  requestContext: {http: {path: string}};
}) {
  const playerId = path.substring(path.lastIndexOf('/') + 1);
  const isDeleted = await deletePlayer(playerId);
  if (isDeleted) {
    return {statusCode: 204};
  }
  return {statusCode: 404, body: 'Player does not exist'};
}

export {handler};
