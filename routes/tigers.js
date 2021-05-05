import express from 'express';
import { tigerList } from '../handlers/tiger_list';
import { tigerSightings } from '../handlers/tiger_sightings';

const router = express.Router();

router.get('/tigers', tigerList);

router.get('/tiger/:id/sightings', tigerSightings);

router.post('/tiger', (req, res) => {
  res.send(`Created a tiger`);
});

router.post('/tiger', (req, res) => {
  res.send(`Created a tiger`);
});

router.post('/tiger/:id/sighting', (req, res) => {
  res.send(`Created a tiger shighting`);
});

module.exports = router;
