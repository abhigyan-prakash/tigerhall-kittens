import { fetchAllTigers } from '../models/tiger';
import _ from 'lodash';

export async function getTigerList(context) {
  const tigers = await fetchAllTigers(context, 'desc');

  let tigerList = [];
  if (!_.isEmpty(tigers)) {
    for (const tiger of tigers) {
      tigerList.push({
        id: tiger.tiger_id,
        name: tiger.name,
        dateOfBirth: tiger.date_of_birth,
        lastSeenAt: tiger.last_seen_at,
        lastSeen: {
          lat: tiger.last_seen.y,
          lng: tiger.last_seen.x
        },
        image: tiger.image
      });
    }
  }

  return tigerList;
}
