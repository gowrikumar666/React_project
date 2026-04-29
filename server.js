import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import OpenAI from 'openai';

const app = express();
const PORT = 4000;
const dataFile = path.resolve(process.cwd(), 'people.json');
const usersFile = path.resolve(process.cwd(), 'users.json');

// Initialize OpenAI (replace with your API key)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
});

app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
app.use(cookieParser());
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

const dedupePeople = (people) => {
  const uniqueKey = (p) => `${(p.name||'').trim().toLowerCase()}|${(p.address||'').trim().toLowerCase()}|${(p.gender||'').trim().toLowerCase()}|${(p.occupation||'').trim().toLowerCase()}`;
  return people.filter((p, idx, arr) => arr.findIndex(q => uniqueKey(q) === uniqueKey(p)) === idx);
};

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const isHashedPassword = (password) => /^[a-f0-9]{64}$/.test(password);

const readUsers = async () => {
  try {
    const file = await fs.readFile(usersFile, 'utf8');
    const users = JSON.parse(file);
    let updated = false;
    const normalized = users.map(user => {
      if (!isHashedPassword(user.password)) {
        updated = true;
        return { ...user, password: hashPassword(user.password) };
      }
      return user;
    });
    if (updated) {
      await writeUsers(normalized);
    }
    return normalized;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(usersFile, '[]', 'utf8');
      return [];
    }
    throw error;
  }
};

const writeUsers = async data => {
  await fs.writeFile(usersFile, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/api/people', async (req, res) => {
  try {
    const people = await readData();
    const deduped = dedupePeople(people);
    if (deduped.length !== people.length) {
      await writeData(deduped);
    }
    res.json(deduped);
  } catch (error) {
    console.error('GET /api/people error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to read people data.' });
  }
});

app.get('/api/tables', async (req, res) => {
  res.json([
    { id: 'people', label: 'People Records' },
    { id: 'gender_summary', label: 'Gender Summary' },
  ]);
});

app.get('/api/table-data', async (req, res) => {
  try {
    const table = String(req.query.table || '');
    const people = dedupePeople(await readData());

    if (table === 'people') {
      return res.json(people);
    }

    if (table === 'gender_summary') {
      const summary = people.reduce((acc, person) => {
        const key = (person.gender || 'Unknown').trim();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      return res.json(Object.entries(summary).map(([label, value]) => ({ label, value })));
    }

    res.status(400).json({ error: 'Unknown table selection' });
  } catch (error) {
    console.error('GET /api/table-data error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unable to load table data.' });
  }
});

app.post('/api/people', async (req, res) => {
  try {
    const people = await readData();
    let newPeople = [];
    // Helper to check uniqueness (by name, address, gender, occupation)
    const uniqueKey = (p) => `${(p.name||'').trim().toLowerCase()}|${(p.address||'').trim().toLowerCase()}|${(p.gender||'').trim().toLowerCase()}|${(p.occupation||'').trim().toLowerCase()}`;
    const existingKeys = new Set(people.map(uniqueKey));

    if (Array.isArray(req.body)) {
      // Remove duplicates within the uploaded batch
      const batch = req.body.filter((p, idx, arr) =>
        arr.findIndex(q => uniqueKey(q) === uniqueKey(p)) === idx
      );
      // Only add those not already present
      newPeople = batch.filter(p => !existingKeys.has(uniqueKey(p))).map(person => ({ id: Date.now() + Math.random(), ...person }));
    } else {
      // Single person: only add if not duplicate
      if (!existingKeys.has(uniqueKey(req.body))) {
        newPeople = [{ id: Date.now(), ...req.body }];
      }
    }
    // Merge and deduplicate all people (in case file already has dups)
    const allPeople = [...people, ...newPeople];
    const deduped = allPeople.filter((p, idx, arr) =>
      arr.findIndex(q => uniqueKey(q) === uniqueKey(p)) === idx
    );
    await writeData(deduped);
    res.status(201).json(deduped);
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
    console.log('Received location:', req.body);
    res.status(201).json({ message: 'Location data received', data: req.body });
  } catch (error) {
    console.error('POST /api/location error:', error);
    res.status(500).json({ error: 'Failed to save location data.' });
  }
});

// Auth endpoints
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readUsers();
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = { id: Date.now(), email, password: hashPassword(password) };
    users.push(newUser);
    await writeUsers(users);
    const token = jwt.sign({ id: newUser.id, email }, 'secretkey', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: false, secure: false, sameSite: 'lax' });
    res.json({ token, user: { email } });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readUsers();
    const hash = hashPassword(password);
    const user = users.find(u => u.email === email && u.password === hash);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email }, 'secretkey', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: false, secure: false, sameSite: 'lax' });
    res.json({ token, user: { email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route example
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// Chat endpoint
app.post('/api/chat', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Mock response for demo
      const mockReplies = [
        "Hello! How can I assist you today?",
        "I'm here to help with any questions you have.",
        "That's an interesting query. Can you provide more details?",
        "I'm a demo chatbot. Please set your OpenAI API key for real responses.",
      ];
      const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      return res.json({ reply });
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
