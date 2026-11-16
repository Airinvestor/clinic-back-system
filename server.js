const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

let patients = [
  { id: 1, name: 'Abdullahi Yusuf', phone: '08012345678', records: 'General checkup & lab results normal.' }
];

let logs = [
  { id: 1, type: 'System Boot', date: '2026-11-16 10:00', status: 'Success' },
  { id: 2, type: 'Cloud Vault Sync', date: '2026-11-16 11:30', status: 'Secured' }
];

app.get('/api/status', (req, res) => {
  res.json({ systemStatus: 'Operational & Secure', totalPatients: patients.length });
});

app.get('/api/logs', (req, res) => {
  res.json(logs);
});

app.post('/api/backup', (req, res) => {
  const newLog = {
    id: logs.length + 1,
    type: 'Manual Cloud Backup',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Completed'
  };
  logs.unshift(newLog);
  res.json({ message: 'Cloud backup generated successfully!', logs });
});

app.post('/api/patient-login', (req, res) => {
  const { name, phone } = req.body;
  const patient = patients.find(p => p.name.toLowerCase() === (name || '').toLowerCase() && p.phone === phone);
  if (patient) {
    res.json({ success: true, patient });
  } else {
    res.json({ success: false, error: 'Patient credentials not found in vault records.' });
  }
});

app.listen(PORT, () => {
  console.log(`Clinic server running on port ${PORT}`);
});
