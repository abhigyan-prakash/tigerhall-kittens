import { tigerIds } from '../tiger_unique_ids';
import faker from 'faker';

export function seed(knex) {
  return knex('tigers')
    .del()
    .then(() => {
      let rows = [];
      for (let id of tigerIds) {
        rows.push({
          id,
          name: faker.name.firstName(),
          date_of_birth: faker.date.between('2015-01-01', '2021-01-01')
        });
      }

      // Inserts seed entries
      return knex('tigers').insert(rows);
    });
}
