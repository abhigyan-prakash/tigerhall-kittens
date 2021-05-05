import _ from 'lodash';
import validateUUID from 'uuid-validate';
import { BadRequest } from '../boot/errors';
import { getTigerSightingsById } from '../logic/tiger';

export async function tigerSightings(req, res, next) {
  const tigerId = req.params.id;

  if (_.isEmpty(tigerId)) {
    next(new BadRequest('No tiger id specified'));
    return;
  }

  if (!validateUUID(tigerId)) {
    next(new BadRequest('Not a valid tiger id'));
    return;
  }

  try {
    const tigerSightings = await getTigerSightingsById(req.context, tigerId);

    res.json({ tigerSightings });
  } catch (err) {
    next(new GeneralError('Something went wrong.'));
  }
}
