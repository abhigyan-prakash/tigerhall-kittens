import { HEADER_CORRELATIONID } from './defines';
import uuid4 from 'uuid-random';
import CallContext from './call_context';

/**
 * Middleware that creates the request context and sets it on the request
 */
export async function createRequestContext(request, response, next) {
  const correlationId = request.get(HEADER_CORRELATIONID) || uuid4();

  let context = new CallContext({
    // Send the previous correlationId - if any
    correlationId,
    request,
    response
  });

  // Set the response correlation ID
  response.set(HEADER_CORRELATIONID, context.correlationId);

  // Create a new context for every request
  request.context = context;

  // Log the request URL
  request.context.logger.info(
    `Received a '${request.method}' request on path ${request.originalUrl}`
  );

  // Log the request end
  response.on('close', () => {
    context.logger.debug(`HTTP Requested ended on path ${request.originalUrl}`);
  });

  request.context.logger.trace(request);

  next();
}

/**
 * Default route that handles all unmatched requests - returns 404
 */
export function handle404(request, response) {
  response.sendStatus(404);

  request.context.logger.info(
    `The request did not match any route; Returning StatusCode ${response.statusCode}`
  );
}
