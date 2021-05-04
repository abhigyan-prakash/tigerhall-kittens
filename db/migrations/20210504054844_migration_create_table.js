export function up(knex) {
  return knex.schema
    .createTable('tigers', table => {
      table.uuid('id').primary();
      table.uuid('sighting_id').notNullable();
      table.string('name');
      table.date('date_of_birth');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('tiger_sightings', table => {
      table.uuid('id').primary();
      table.uuid('tiger_id').notNullable();
      table.timestamp('last_seen_at').defaultTo(knex.fn.now());
      table.specificType('last_seen', 'Point');
      table.string('image', 1000).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export function down(knex) {
  return knex.schema.dropTable('tigers').dropTable('tiger_sightings');
}
