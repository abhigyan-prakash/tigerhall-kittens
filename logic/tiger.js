import { fetchAllTigers, fetchTigerSightings } from '../models/tiger';
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
        lastSeenAt: tiger.seen_at,
        lastSeenCord: {
          lat: tiger.seen_cord.y,
          lng: tiger.seen_cord.x
        },
        image: tiger.image
      });
    }
  }

  return tigerList;
}

export async function getTigerSightingsById(context, tigerId) {
  if (_.isNil(tigerId)) {
    return null;
  }

  const sightings = await fetchTigerSightings(context, tigerId);

  let sightingList = [];
  for (const sighting of sightings) {
    sightingList.push({
      id: sighting.id,
      seenAt: sighting.seen_at,
      seenCord: {
        lat: sighting.seen_cord.y,
        lng: sighting.seen_cord.x
      },
      image: sighting.image
    });
  }

  return sightingList;
}
