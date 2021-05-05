export function up(knex) {
  return knex.schema.alterTable('tiger_sightings', table => {
    table.dropColumn('seen_cord');
    table.decimal('seen_cord_lat', 10, 8);
    table.decimal('seen_cord_lng', 11, 8);
  });
}

export function down(knex) {}
