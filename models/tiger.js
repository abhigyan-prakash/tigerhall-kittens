import KnexConnector from '../boot/knex_connector';

export async function fetchAllTigers(context, lastSeen = 'desc') {
  const knex = await KnexConnector(context);

  context.logger.debug('Fetching all tigers');

  let tigers = [];
  try {
    tigers = await knex
      .select()
      .from('tigers')
      .join('tiger_sightings', 'tigers.sighting_id', 'tiger_sightings.id');
  } catch (err) {
    context.logger.error(err, 'Could not fetch tigers');
    throw err;
  }

  return tigers;
}

export async function fetchTigerSightings(context, tigerId) {
  const knex = await KnexConnector(context);

  context.logger.debug(`Fetching all sightings of the tiger: ${tigerId}`);

  let sightings = [];
  try {
    sightings = await knex
      .select()
      .from('tiger_sightings')
      .where('tiger_id', tigerId)
      .orderBy('seen_at', 'desc');
  } catch (err) {
    context.logger.error(err, 'Could not fetch sightings of the tiger');
    throw err;
  }

  return sightings;
}

export async function fetchTiger(context, name) {
  const knex = await KnexConnector(context);

  context.logger.debug(`Fetching tiger by name: ${name}`);

  let tiger;
  try {
    tiger = await knex.select().from('tigers').where('name', name);
  } catch (err) {
    context.logger.error(err, 'Error fetching the tiger');
    throw err;
  }

  return tiger;
}

export async function addTiger(context, tigerData = {}) {
  const knex = await KnexConnector(context);

  context.logger.debug('Adding a new tiger');

  try {
    knex.transaction(async trx => {
      await knex('tigers').insert(tigerData.tiger).transacting(trx);
      await knex('tiger_sightings').insert(tigerData.sighting).transacting(trx);
    });
  } catch (err) {
    context.logger.error(err, 'Cannot add tiger to db');
    throw err;
  }
}
