import express from 'express';

const router = express.Router();

router.get('/tigers', (req, res) => {
  res.send('List of all tigers');
});

router.get('/tiger/:id/sightings', (req, res) => {
  res.send(`List of all sighting of tiger: ${req.params.id}`);
});

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
