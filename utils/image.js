import fs from 'fs';
import path from 'path';
import { getConfig } from '../boot/config';

export async function saveImage(context, image) {
  let tempPath = image.path;
  let destDir = path.join(__dirname, '../', getConfig('upload.image.dir'));
  let destPath = path.join(destDir, image.name);

  try {
    // Check if destination exists; if not create it
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    context.logger.debug(`Saving image to ${destPath}`);
    await fs.promises.rename(tempPath, destPath);
  } catch (err) {
    context.logger.error(err, `Could not remove temp file`);
    throw err;
  }
}
