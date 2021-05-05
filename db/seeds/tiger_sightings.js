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
          seen_at: faker.date.recent(),
          seen_cord_lat: faker.address.longitude(),
          seen_cord_lng: faker.address.latitude(),
          image: faker.image.imageUrl()
        });
      }

      return knex('tiger_sightings').insert(rows);
    });
}
