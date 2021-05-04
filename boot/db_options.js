import { getConfig } from './config';
import _ from 'lodash';
import path from 'path';

export default function dbOptions(currentEnv) {
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
    connection: cOptions,
    migrations: {
      directory: path.join(__dirname, '../', '/db/migrations')
    }
  };

  if (currentEnv === 'develop') {
    kOptions = Object.assign(kOptions, {
      seeds: {
        directory: path.join(__dirname, '../', '/db/seeds')
      }
    });
  }

  return kOptions;
}
