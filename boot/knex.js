import { getConfig } from './config';
import _knex from 'knex';
import _ from 'lodash';

let knexConn;
export default async function knex(context) {
  if (_.isEmpty(knexConn)) {
    const dbConfig = getConfig('db');
    const cOptions = _.pick(dbConfig, [
      'host',
      'port',
      'password',
      'user',
      'database',
      'timezone'
    ]);

    let kOptions = {
      client: dbConfig.client,
      connection: cOptions
    };

    context.logger.info(`Initializing knex with options`);
    knexConn = _knex(kOptions);
  }

  return knexConn;
}
