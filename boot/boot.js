import express from 'express';
import CallContextStatic from './call_context_static';
import { parseConfig, getConfig } from './config';
import { createRequestContext, handle404 } from './middlewares';
import router from '../routes';
import knex from './knex';
import _ from 'lodash';

let staticContext = null;

const bootDefaults = {
  initExpress: false,
  initDb: false
};

export async function boot(options) {
  options = _.merge({}, bootDefaults, options);

  // Load app config
  staticContext = new CallContextStatic();
  let currentEnv = (process.env.ENV || 'develop').toLowerCase();

  let config = await parseConfig(staticContext, currentEnv);

  if (options.initDb) {
    // Initiate db connection
    await knex(staticContext, currentEnv);
  }

  if (options.initExpress) {
    let app = express();

    // Initialize the request context
    app.use(createRequestContext);

    // Initialize routes
    app.use(router);

    const port = getConfig('listen.http.port');
    if (port === undefined) {
      staticContext.logger.error('listen port not configured');
      return process.exit(9);
    }

    // Reply with 404 for unmatches routes
    app.use('*', handle404);

    // Start server listening
    let server = app.listen(port);

    server.keepAliveTimeout =
      getConfig('listen.http.keep_alive_timeout_seconds') * 1000;
    staticContext.logger.debug(
      `Using a keep-alive timeout of ${server.keepAliveTimeout}ms`
    );
    server.headersTimeout =
      getConfig('listen.http.headers_timeout_seconds') * 1000;
    staticContext.logger.debug(
      `Using a headers timeout of ${server.headersTimeout}ms`
    );

    staticContext.logger.info(`listening on ${port}`);
  }
}
