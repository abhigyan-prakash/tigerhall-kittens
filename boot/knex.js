import dbOptions from './db_options';
import _knex from 'knex';
import _ from 'lodash';

let knexConn;
export default async function knex(context, currentEnv) {
  if (_.isEmpty(knexConn)) {
    context.logger.info(`Initializing knex with options`);
    knexConn = _knex(dbOptions(currentEnv));
  }

  return knexConn;
}
