import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getConfig } from '../boot/config';

export async function saveImage(context, image) {
  let tempPath = image.path;
  let destDir = path.join(__dirname, '../', getConfig('upload.image.dir'));
  let destPath = path.join(destDir, image.name);

  try {
    // Check if destination exists; if not create it
    if (!fs.existsSync(destDir)) {
      context.logger.debug(
        `Destination directory does not exist: ${destDir}, creating it`
      );
      fs.mkdirSync(destDir, { recursive: true });
    }

    context.logger.debug(`Saving image to ${destPath}`);
    await fs.promises.rename(tempPath, destPath);

    // Resize the image
    resizeImage(context, destPath, image.name);
  } catch (err) {
    context.logger.error(err, `Could not save temp file`);
    throw err;
  }
}

export function getImagePath(context, imageName, resized = true) {
  context.logger.debug(`Generating image path for image: ${imageName}`);

  let uploadImagePath = resized
    ? getConfig('upload.image.resize.path')
    : getConfig('upload.image.path');
  let imagePath = `${uploadImagePath}/${imageName}`;

  return imagePath.replace('\\', '/');
}

function resizeImage(context, imagePath, imageName) {
  context.logger.debug(`Resizing image: ${imageName}`);
  let resizedDir = path.join(
    __dirname,
    '../',
    getConfig('upload.image.resize.dir')
  );

  // Check if destination exists; if not create it
  if (!fs.existsSync(resizedDir)) {
    context.logger.debug(
      `Destination directory does not exist: ${resizedDir}, creating it`
    );
    fs.mkdirSync(resizedDir, { recursive: true });
  }

  sharp(imagePath).resize(250, 200).toFile(path.join(resizedDir, imageName));
}
