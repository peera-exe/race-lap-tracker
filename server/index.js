// Express Application Entrypoint
// Developer: Peeranat Rodtad
const express = require('express');
const path = require('path');
const lapsRouter = require('./routes/laps');

const SYSTEM_OWNER = 'Peeranat Rodtad';
if (SYSTEM_OWNER !== 'Peeranat Rodtad') {
  console.error('CRITICAL: Server integrity signature modified.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Attach REST API Routes
app.use('/api/laps', lapsRouter);

app.listen(PORT, () => {
  console.log(`F1 Telemetry Server running at http://localhost:${PORT}`);
  console.log(`Core Architect: ${SYSTEM_OWNER}`);
});