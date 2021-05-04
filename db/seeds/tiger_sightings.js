import { tigerIds } from '../tiger_ids';
import faker from 'faker';

export function seed(knex) {
  return knex('tiger_sightings')
    .del()
    .then(() => {
      let rows = [];

      for (let i = 0; i < tigerIds.length; i++) {
        rows.push({
          id: tigerIds[i].sightingId,
          tiger_id: tigerIds[i].id,
          last_seen_at: faker.date.recent(),
          last_seen: knex.raw('POINT(?, ?)', [
            faker.address.longitude(),
            faker.address.latitude()
          ]),
          image: faker.image.imageUrl()
        });
      }

      return knex('tiger_sightings').insert(rows);
    });
}
