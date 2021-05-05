import express from 'express';
import { tigerCreate } from '../handlers/tiger_create';
import { tigerList } from '../handlers/tiger_list';
import { tigerSightings } from '../handlers/tiger_sightings';
import { tigerSightingCreate } from '../handlers/tiger_sighting_create';

const router = express.Router();

router.get('/tigers', tigerList);

router.get('/tiger/:id/sightings', tigerSightings);

router.post('/tiger', tigerCreate);

router.post('/tiger/sighting', tigerSightingCreate);

module.exports = router;
