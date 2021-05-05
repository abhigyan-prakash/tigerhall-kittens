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
