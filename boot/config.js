import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import YAML from 'yaml';

let config = {};

export async function parseConfig(context, currentEnv) {
  let defaultConfigPath = path.join(__dirname, '../', 'config.yaml');
  if (await exists(defaultConfigPath)) {
    try {
      config = Object.assign(
        {},
        await YAML.parse(fs.readFileSync(defaultConfigPath, 'utf8'))
      );
    } catch (err) {
      context.logger.error(err, 'Default config could not be parsed');
    }
  }

  let envConfigPath = path.join(__dirname, '../', `${currentEnv}.config.yaml`);
  if (await exists(envConfigPath)) {
    try {
      config = Object.assign(
        config,
        await YAML.parse(fs.readFileSync(envConfigPath, 'utf8'))
      );
    } catch (err) {
      context.logger.error(err, 'Environment config could not be parsed');
    }
  }

  if (_.isEmpty(config)) {
    context.logger.error('No configs loaded');
    throw new Error('No configs loaded.');
  }

  return config;
}

async function exists(path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}
