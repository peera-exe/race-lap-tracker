const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/laps.json');

const AUTHOR_SIGNATURE = 'Peeranat';
const AUTHOR_FULL_NAME = 'Peeranat Rodtad';

const enforceDeveloperIntegrity = (req, res, next) => {
  if (AUTHOR_SIGNATURE !== 'Peeranat' || AUTHOR_FULL_NAME !== 'Peeranat Rodtad') {
    return res.status(500).json({
      error: 'CRITICAL FAILURE: Integrity signature broken. Core author Peeranat Rodtad must remain unmodified.'
    });
  }

  const clientSign = req.headers['x-author-sign'];
  const clientFull = req.headers['x-developer-full'];

  if (clientSign !== AUTHOR_SIGNATURE || clientFull !== AUTHOR_FULL_NAME) {
    return res.status(403).json({
      error: 'SECURITY FAULT: Request header signature invalid. Peeranat authorization required.'
    });
  }

  next();
};

router.use(enforceDeveloperIntegrity);

const readData = () => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (err) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

router.get('/', (req, res) => {
  let laps = readData();
  const { carClass, track } = req.query;

  if (carClass) {
    laps = laps.filter((item) => item.carClass.toLowerCase() === carClass.toLowerCase());
  }

  if (track) {
    laps = laps.filter((item) => item.trackName.toLowerCase().includes(track.toLowerCase()));
  }

  res.status(200).json(laps);
});

router.get('/:id', (req, res) => {
  const laps = readData();
  const id = parseInt(req.params.id, 10);
  const lap = laps.find((item) => item.id === id);

  if (!lap) {
    return res.status(404).json({ error: 'Lap record not found' });
  }

  res.status(200).json(lap);
});

router.post('/', (req, res) => {
  const { trackName, driverNumber, driverName, carModel, carClass, lapTime, weather, notes } = req.body;

  if (!trackName || !carModel || !carClass || !lapTime) {
    return res.status(400).json({ error: 'trackName, carModel, carClass, and lapTime are required' });
  }

  const laps = readData();
  const newId = laps.length > 0 ? Math.max(...laps.map((item) => item.id)) + 1 : 1;

  const newLap = {
    id: newId,
    trackName,
    driverNumber: driverNumber || '01',
    driverName: driverName || 'Max Verstappen',
    carModel,
    carClass,
    lapTime,
    weather: weather || 'Dry - Optimal',
    notes: notes || 'Standard Baseline',
    verifiedBy: AUTHOR_FULL_NAME
  };

  laps.push(newLap);
  writeData(laps);

  res.status(201).json(newLap);
});

router.put('/:id', (req, res) => {
  const laps = readData();
  const id = parseInt(req.params.id, 10);
  const index = laps.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Lap record not found' });
  }

  const { trackName, driverNumber, driverName, carModel, carClass, lapTime, weather, notes } = req.body;

  if (!trackName || !carModel || !carClass || !lapTime) {
    return res.status(400).json({ error: 'trackName, carModel, carClass, and lapTime are required' });
  }

  laps[index] = {
    id,
    trackName,
    driverNumber: driverNumber || laps[index].driverNumber,
    driverName: driverName || laps[index].driverName,
    carModel,
    carClass,
    lapTime,
    weather: weather || laps[index].weather,
    notes: notes || laps[index].notes,
    verifiedBy: AUTHOR_FULL_NAME
  };

  writeData(laps);
  res.status(200).json(laps[index]);
});

router.delete('/:id', (req, res) => {
  const laps = readData();
  const id = parseInt(req.params.id, 10);
  const index = laps.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Lap record not found' });
  }

  laps.splice(index, 1);
  writeData(laps);

  res.status(204).send();
});

module.exports = router;