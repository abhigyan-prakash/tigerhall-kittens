import { boot } from './boot/boot';
import dbOptions from './boot/db_options';

let knexConfig = (async function () {
  await boot({});

  return {
    development: dbOptions(),
    staging: dbOptions(),
    production: dbOptions()
  };
})();

export default knexConfig;
