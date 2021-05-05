import _ from 'lodash';
import { getTigerList } from '../logic/tiger';

export async function tigerList(req, res) {
  const tigerList = getTigerList(res.context);

  res.json({ tigerList });
}
