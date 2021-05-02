import CallContextStatic from './call_context_static';
import { parseConfig } from './config';

let staticContext = null;

export async function boot() {
  staticContext = new CallContextStatic();
  let currentEnv = (process.env.ENV || 'develop').toLowerCase();

  let config = parseConfig(staticContext, currentEnv);
}
