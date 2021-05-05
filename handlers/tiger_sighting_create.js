import _ from 'lodash';
import { BadRequest } from '../boot/errors';
import {
  createTigerSighting,
  getTigerById,
  validateSightCords
} from '../logic/tiger';
import parseForm from '../utils/parse_multipart_request';
import { saveImage } from '../utils/image';
import { getConfig } from '../boot/config';

export async function tigerSightingCreate(req, res, next) {
  let formData = {};

  try {
    req.context.logger.debug('Parsing multipart form request');

    formData = await parseForm(req);
  } catch (err) {
    req.context.logger.error(err, 'error parding multipart form request');
    next(err);
  }

  let sightingData;

  // Validate parsed fields
  if (!_.isEmpty(formData.fields)) {
    let keys = ['tigerId', 'seenAt', 'lat', 'lng'];
    let hasAllKeys = keys.every(key => formData.fields.hasOwnProperty(key));

    if (!hasAllKeys) {
      req.context.logger.error(
        'Not valid request data to create tiger sighting'
      );
      next(new BadRequest('Values missing to create tiger sighting'));
      return;
    }

    sightingData = _.pick(formData.fields, keys);
  }

  // Check if tiger sighting image has been uploaded
  if (_.isEmpty(formData.files) || !_.has(formData.files, 'image')) {
    req.context.logger.error(
      'Not valid request data to create tiger sighting - image missing'
    );
    next(new BadRequest('Image missing to create tiger sighting'));
    return;
  }

  // Validate if tiger exits
  if (_.isEmpty(await getTigerById(req.context, sightingData.tigerId))) {
    req.context.logger.error(`Not valid tiger id: ${sightingData.tigerId}`);
    next(new BadRequest('Not valid tiger id'));
    return;
  }

  // Validate if sighting cordinates are outside radius
  let radius = getConfig('sighting.radius_in_km');
  let sightCords = {
    lat: sightingData.lat,
    lng: sightingData.lng
  };
  if (
    !(await validateSightCords(
      req.context,
      sightingData.tigerId,
      sightCords,
      radius
    ))
  ) {
    req.context.logger.error(
      `Sighting cordinates: ${sightCords} are not outside radius: ${radius}`
    );
    next(new BadRequest('Sighting cordinates not outside radius'));
    return;
  }

  let imageName;
  let image = formData.files.image;

  // Move the uploaded image from temporary to persistent location
  try {
    await saveImage(req.context, image);
    imageName = image.name;
  } catch (err) {
    req.context.logger.error(err, 'not able to save image');
    next(err);
    return;
  }

  // save the tiger sighting data
  try {
    await createTigerSighting(
      req.context,
      Object.assign(sightingData, { image: imageName })
    );

    res.json({
      status: 'success',
      message: 'created tiger sighting successfully'
    });
  } catch (err) {
    req.context.logger.error(err, 'not able to create tiger sighting');
    next(err);
  }
}
