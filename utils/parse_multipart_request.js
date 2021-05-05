import formidable from 'formidable';

export default async function parseForm(req, options = {}) {
  req.context.logger.debug('Parsing multipart form request');

  let form = new formidable.IncomingForm(options);
  form.hash = 'md5';

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ fields: fields, files: files });
    });
  });
}
