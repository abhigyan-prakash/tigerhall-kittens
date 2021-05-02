import pino from 'pino';

const pinoDefaults = {
  name: undefined,
  level: 'info',
  enabled: true,
  timestamp: true,
  base: null
};

let _pino = pino(pinoDefaults);

export const Logger = {
  get logger() {
    if (!this._logger) {
      this._logger = _pino;
    }

    return this._logger;
  },

  debug(...args) {
    return this.log('debug', ...args);
  },

  warn(...args) {
    return this.log('warn', ...args);
  },

  error(...args) {
    return this.log('error', ...args);
  },

  info(...args) {
    return this.log('info', ...args);
  },

  trace(...args) {
    return this.log('trace', ...args);
  },

  log(method, ...args) {
    //args = this.prependScopeArgs(...args);

    return this.logger[method](...args);
  }

  //prependScopeArgs(...args) {}
};
