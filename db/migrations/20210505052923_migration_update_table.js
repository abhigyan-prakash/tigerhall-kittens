export function up(knex) {
  return knex.schema.alterTable('tigers', table => {
    table.unique('name');
  });
}

export function down(knex) {}
