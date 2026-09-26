// 1. ฟังก์ชันดึงรายการจาก API มาแสดงผล พร้อมปุ่มลบ
async function fetchWorkouts() {
  const category = document.getElementById('filter-category').value;
  let url = '/api/workouts';
  if (category) {
    url += `?category=${category}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    const list = document.getElementById('workout-list');
    list.innerHTML = '';

    data.forEach(item => {
      const li = document.createElement('li');
      li.style.cssText = 'padding: 12px; margin-bottom: 8px; background: #f9f9f9; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;';
      li.innerHTML = `
        <div>
          <strong>${item.title}</strong> (${item.category}) - ${item.duration} นาที
          <br><small style="color: #666;">วันที่: ${item.date || '-'}</small>
        </div>
        <button onclick="deleteWorkout(${item.id})" style="background-color: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">ลบ</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching workouts:', err);
  }
}

// 2. ฟังก์ชันลบรายการ (DELETE)
async function deleteWorkout(id) {
  if (!confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) return;

  try {
    const res = await fetch(`/api/workouts/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      fetchWorkouts(); // โหลดรายการใหม่มาแสดงทันที
    }
  } catch (err) {
    console.error('Error deleting workout:', err);
  }
}

// 3. ดักจับการส่งฟอร์มเพิ่มรายการ (POST)
document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const duration = document.getElementById('duration').value;
  const date = document.getElementById('date').value;

  try {
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, duration, date })
    });

    if (res.ok) {
      document.getElementById('add-form').reset();
      fetchWorkouts();
    }
  } catch (err) {
    console.error('Error adding workout:', err);
  }
});

// 4. โหลดรายการเมื่อเปิดหน้าเว็บ
fetchWorkouts();