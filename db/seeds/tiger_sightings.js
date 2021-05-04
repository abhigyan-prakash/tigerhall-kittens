import { tigerIds } from '../tiger_unique_ids';
import faker from 'faker';

export function seed(knex) {
  return knex('tiger_sightings')
    .del()
    .then(() => {
      let rows = [];
      let questionMarks = '';
      let values = [];

      for (let id of tigerIds) {
        rows.push({
          tiger_id: id,
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
