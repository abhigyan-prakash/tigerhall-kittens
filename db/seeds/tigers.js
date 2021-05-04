import { tigerIds } from '../tiger_ids';
import faker from 'faker';

export function seed(knex) {
  return knex('tigers')
    .del()
    .then(() => {
      let rows = [];

      for (let i = 0; i < tigerIds.length; i++) {
        rows.push({
          id: tigerIds[i].id,
          sighting_id: tigerIds[i].sightingId,
          name: faker.name.firstName(),
          date_of_birth: faker.date.between('2015-01-01', '2021-01-01')
        });
      }

      // Inserts seed entries
      return knex('tigers').insert(rows);
    });
}
