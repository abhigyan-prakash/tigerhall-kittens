import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const subRouters = [];

const getAllSubroutes = dir => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      getAllSubroutes(fullPath);
    } else {
      if (fullPath != __filename) {
        let subRoute = require(fullPath);
        subRouters.push(subRoute);
      }
    }

    return subRouters;
  });
};

getAllSubroutes(__dirname);
router.use(subRouters);

export default router;
