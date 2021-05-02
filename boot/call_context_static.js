import { UUID_EMPTY } from '../defines';
import CallContext from './call_context';

export default function CallContextStatic() {
  let callContext = new CallContext();
  callContext.correlationId = UUID_EMPTY;

  return callContext;
}
