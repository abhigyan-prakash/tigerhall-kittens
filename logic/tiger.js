import {
  addTiger,
  addTigerSighting,
  fetchAllTigers,
  fetchTiger,
  fetchTigerById,
  fetchTigerSightings
} from '../models/tiger';
import _ from 'lodash';
import uuid4 from 'uuid-random';
import { getImagePath } from '../utils/image';
import { getConfig } from '../boot/config';
import { headingDistanceTo } from 'geolocation-utils';

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
        image: getImagePath(context, tiger.image)
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
      image: getImagePath(context, sighting.image)
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
      tiger_id: tigerId,
      seen_at: new Date(tigerData.lastSeenAt),
      seen_cord_lat: tigerData.lat,
      seen_cord_lng: tigerData.lng,
      image: tigerData.image
    }
  });

  return true;
}

export async function getTigerById(context, id) {
  if (_.isEmpty(id)) {
    context.logger.debug('No tiger id provided');
    return null;
  }

  let tiger = await fetchTigerById(context, id);
  if (!_.isEmpty(tiger)) {
    return {
      id: tiger.id,
      name: tiger.name,
      dateOfBirth: tiger.date_of_birth
    };
  }

  return null;
}

export async function createTigerSighting(context, sighting = {}) {
  if (_.isEmpty(sighting)) {
    context.logger.debug(
      'No tiger sighting data provided to create tiger sighting'
    );
    return false;
  }

  const sightingId = uuid4();

  await addTigerSighting(context, {
    id: sightingId,
    tiger_id: sighting.tigerId,
    seen_at: new Date(sighting.seenAt),
    seen_cord_lat: sighting.lat,
    seen_cord_lng: sighting.lng,
    image: sighting.image
  });

  return true;
}

export async function validateSightCords(context, tigerId, sightCords, radius) {
  if (_.isEmpty(tigerId)) {
    context.logger.debug('No tiger id provided');
    return false;
  }

  if (_.isEmpty(sightCords)) {
    context.logger.debug('No sighting cordinates provided');
    return false;
  }

  if (!radius) {
    context.logger.debug('No radius provided');
    return false;
  }

  let tigerSightings = await fetchTigerSightings(context, tigerId);

  // Check if any tiger signtings are there
  if (_.isEmpty(tigerSightings)) {
    return true;
  }

  // Convert config radius to meters
  radius = radius * 1000;

  // Loop through all previous sightings to check if cords lie within radius
  for (let sighting of tigerSightings) {
    if (
      headingDistanceTo(
        {
          lat: parseFloat(sightCords.lat),
          lon: parseFloat(sightCords.lng)
        },
        {
          lat: parseFloat(sighting.seen_cord_lat),
          lon: parseFloat(sighting.seen_cord_lng)
        }
      ) <= radius
    ) {
      return false;
    }
  }

  return true;
}
