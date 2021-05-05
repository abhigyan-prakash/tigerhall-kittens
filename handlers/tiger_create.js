import _ from 'lodash';
import { BadRequest } from '../boot/errors';
import { createTiger } from '../logic/tiger';
import parseForm from '../utils/parse_multipart_request';
import { saveImage } from '../utils/image';

export async function tigerCreate(req, res, next) {
  let formData = {};

  try {
    req.context.logger.debug('Parsing multipart form request');

    formData = await parseForm(req);
  } catch (err) {
    req.context.logger.error(err, 'error parding multipart form request');
    next(err);
  }

  let tigerData;

  // Validate parsed fields
  if (!_.isEmpty(formData.fields)) {
    let keys = ['name', 'dateOfBirth', 'lastSeenAt', 'lat', 'lng'];
    let hasAllKeys = keys.every(key => formData.fields.hasOwnProperty(key));

    if (!hasAllKeys) {
      req.context.logger.error('Not valid request data to create tiger');
      next(new BadRequest('Values missing to create tiger'));
      return;
    }

    tigerData = _.pick(formData.fields, keys);
  }

  let imageName;
  // Check if image has been uploaded
  if (!_.isEmpty(formData.files)) {
    if (_.has(formData.files, 'image')) {
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
    }
  }

  // save the tiger data
  try {
    await createTiger(
      req.context,
      Object.assign(tigerData, { image: imageName })
    );

    res.json({ status: 'success', message: 'created tiger successfully' });
  } catch (err) {
    req.context.logger.error(err, 'not able to create tiger');
    next(err);
  }
}
