import { boot } from './boot/boot';
import dbOptions from './boot/db_options';

let knexConfig = (async function () {
  await boot({});

  return {
    development: dbOptions('develop'),
    staging: dbOptions('staging'),
    production: dbOptions('prod')
  };
})();

export default knexConfig;
