import dbOptions from './db_options';
import { knex } from 'knex';
import _ from 'lodash';

let knexConn;
export default async function KnexConnector(context, currentEnv) {
  if (_.isEmpty(knexConn)) {
    context.logger.info(`Initializing knex with options`);
    knexConn = knex(dbOptions(currentEnv));
  }

  return knexConn;
}
