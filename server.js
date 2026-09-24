const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let workouts = [
  { id: 1, title: 'ตีแบดมินตัน', category: 'badminton', duration: 60, date: '2026-09-24' },
  { id: 2, title: 'วิ่งลู่วิ่ง', category: 'cardio', duration: 30, date: '2026-09-24' },
  { id: 3, title: 'เล่นเวทแขน', category: 'weight', duration: 45, date: '2026-09-24' }
];

app.get('/api/workouts', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = workouts.filter(w => w.category.toLowerCase() === category.toLowerCase());
    return res.json(filtered);
  }
  res.json(workouts);
});

app.get('/api/workouts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = workouts.find(w => w.id === id);
  if (!item) {
    return res.status(404).json({ message: 'ไม่พบรายการออกกำลังกายนี้' });
  }
  res.json(item);
});

app.post('/api/workouts', (req, res) => {
  const { title, category, duration, date } = req.body;

  if (!title || !category || !duration) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน กรุณากรอก title, category และ duration' });
  }

  const newItem = {
    id: workouts.length > 0 ? Math.max(...workouts.map(w => w.id)) + 1 : 1,
    title,
    category,
    duration: Number(duration),
    date: date || new Date().toISOString().split('T')[0]
  };

  workouts.push(newItem);
  res.status(201).json(newItem);
});

app.patch('/api/workouts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = workouts.findIndex(w => w.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบรายการที่ต้องการแก้ไข' });
  }

  const { title, category, duration, date } = req.body;
  if (title) workouts[index].title = title;
  if (category) workouts[index].category = category;
  if (duration) workouts[index].duration = Number(duration);
  if (date) workouts[index].date = date;

  res.json(workouts[index]);
});

app.delete('/api/workouts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = workouts.findIndex(w => w.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบรายการที่ต้องการลบ' });
  }

  workouts.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});