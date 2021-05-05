import _ from 'lodash';
import { GeneralError } from '../boot/errors';
import { getTigerList } from '../logic/tiger';

export async function tigerList(req, res, next) {
  try {
    const tigerList = await getTigerList(req.context);

    res.json({ tigerList });
  } catch (err) {
    next(new GeneralError('Something went wrong.'));
  }
}
