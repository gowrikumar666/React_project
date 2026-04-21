import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
const PORT = 4000;
const dataFile = path.resolve(process.cwd(), 'people.json');

app.use(cors());
app.use(express.json());

const readData = async () => {
  try {
    const file = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFile, '[]', 'utf8');
      return [];
    }
    throw error;
  }
};

const writeData = async data => {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/api/people', async (req, res) => {
  try {
    const people = await readData();
    res.json(people);
  } catch (error) {
    console.error('GET /api/people error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to read people data.' });
  }
});

app.post('/api/people', async (req, res) => {
  try {
    const people = await readData();
    const nextId = Date.now();
    const newPerson = { id: nextId, ...req.body };
    const updated = [...people, newPerson];
    await writeData(updated);
    res.status(201).json(updated);
  } catch (error) {
    console.error('POST /api/people error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to save new person.' });
  }
});

app.put('/api/people/:id', async (req, res) => {
  try {
    const people = await readData();
    const id = Number(req.params.id);
    const updated = people.map(person => person.id === id ? { ...person, ...req.body } : person);
    await writeData(updated);
    res.json(updated);
  } catch (error) {
    console.error('PUT /api/people/:id error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to update person.' });
  }
});

app.delete('/api/people/:id', async (req, res) => {
  try {
    const people = await readData();
    const id = Number(req.params.id);
    const updated = people.filter(person => person.id !== id);
    await writeData(updated);
    res.json(updated);
  } catch (error) {
    console.error('DELETE /api/people/:id error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to delete person.' });
  }
});

// Location form endpoint
app.post('/api/location', async (req, res) => {
  try {
    // You can customize how you want to store or process location data
    // For demo, just log and return success
    console.log('Received location:', req.body);
    res.status(201).json({ message: 'Location data received', data: req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save location data.' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
