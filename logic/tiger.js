import {
  addTiger,
  fetchAllTigers,
  fetchTiger,
  fetchTigerSightings
} from '../models/tiger';
import _ from 'lodash';
import uuid4 from 'uuid-random';

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
          lat: tiger.seen_cord_lat,
          lng: tiger.seen_cord_lng
        },
        image: tiger.image
      });
    }
  }

  return tigerList;
}

export async function getTigerSightingsById(context, tigerId) {
  if (_.isNil(tigerId)) {
    context.logger.debug('No tiger id provided');
    return null;
  }

  const sightings = await fetchTigerSightings(context, tigerId);

  let sightingList = [];
  for (const sighting of sightings) {
    sightingList.push({
      id: sighting.id,
      seenAt: sighting.seen_at,
      seenCord: {
        lat: sighting.seen_cord_lat,
        lng: sighting.seen_cord_lng
      },
      image: sighting.image
    });
  }

  return sightingList;
}

export async function getTigerByName(context, name) {
  if (_.isEmpty(name)) {
    context.logger.debug('No tiger name provided');
    return null;
  }

  let tiger = await fetchTiger(context, name);
  if (!_.isEmpty(tiger)) {
    return {
      id: tiger.id,
      name: tiger.name,
      dateOfBirth: tiger.date_of_birth
    };
  }

  return null;
}

export async function createTiger(context, tigerData = {}) {
  if (_.isEmpty(tigerData)) {
    context.logger.debug('No tiger data provided to create tiger');
    return false;
  }

  const tigerId = uuid4();
  const sightingId = uuid4();

  await addTiger(context, {
    tiger: {
      id: tigerId,
      sighting_id: sightingId,
      name: tigerData.name,
      date_of_birth: tigerData.dateOfBirth
    },
    sighting: {
      id: sightingId,
      tigerId: tigerId,
      seen_at: tigerData.lastSeenAt,
      seen_cord_lat: tigerData.seenCord.lat,
      seen_cord_lng: tigerData.seenCord.lng,
      image: tigerData.image
    }
  });

  return true;
}
