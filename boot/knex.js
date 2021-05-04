import dbOptions from './db_options';
import _knex from 'knex';
import _ from 'lodash';

let knexConn;
export default async function knex(context) {
  if (_.isEmpty(knexConn)) {
    context.logger.info(`Initializing knex with options`);
    knexConn = _knex(dbOptions());
  }

  return knexConn;
}
