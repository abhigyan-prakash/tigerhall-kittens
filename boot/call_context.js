import { Logger } from './logger';
import uuid4 from 'uuid-random';
import uuidValidate from 'uuid-validate';

export default function CallContext(contextData) {
  contextData = contextData || null;

  this.request = null;
  this.response = null;
  this.logger = null;

  if (!this.logger) {
    this.logger = Logger;
  }

  if (contextData !== null) {
    if (uuidValidate(contextData.correlationId)) {
      this.correlationId = contextData.correlationId;
    }

    this.request = contextData.request || null;
    this.response = contextData.response || null;
  }

  if (!this.correlationId) {
    this.correlationId = uuid4();
  }

  return this;
}
