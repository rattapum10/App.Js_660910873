const API_URL = '/api/workouts';

// ดึงรายการข้อมูล (GET /api/workouts)
async function fetchWorkouts() {
  const category = document.getElementById('filter-category').value;
  const url = category ? `${API_URL}?category=${category}` : API_URL;

  const res = await fetch(url);
  const data = await res.json();

  const list = document.getElementById('workout-list');
  list.innerHTML = '';

  data.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${item.title}</strong> [${item.category}] - ${item.duration} นาที (${item.date})
      </div>
      <button class="btn-delete" onclick="deleteWorkout(${item.id})">ลบ</button>
    `;
    list.appendChild(li);
  });
}

// เพิ่มรายการใหม่ (POST /api/workouts)
document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const duration = document.getElementById('duration').value;
  const date = document.getElementById('date').value;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, duration, date })
  });

  if (res.status === 201) {
    document.getElementById('add-form').reset();
    fetchWorkouts();
  } else {
    const err = await res.json();
    alert(err.message);
  }
});

// ลบรายการ (DELETE /api/workouts/:id)
async function deleteWorkout(id) {
  if (!confirm('ต้องการลบรายการนี้ใช่หรือไม่?')) return;

  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.status === 204) {
    fetchWorkouts();
  }
}

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
fetchWorkouts();