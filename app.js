document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMsg = document.getElementById('error-message');
  
  const loginSection = document.getElementById('login-section');
  const studentSection = document.getElementById('student-section');
  const adminSection = document.getElementById('admin-section');

  // 관리자 비밀번호 
  const ADMIN_ID = "관리자";
  const ADMIN_PW = "233712";

  // 로그인 처리
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // 1. 관리자 로그인 확인
    if (username === ADMIN_ID && password === ADMIN_PW) {
      showAdminDashboard();
      return;
    }

    // 2. 수강생 로그인 확인 (data.js의 studentData 참조)
    const student = studentData.find(s => s.name === username && s.password === password);
    
    if (student) {
      showStudentDashboard(student);
    } else {
      errorMsg.textContent = "이름 또는 비밀번호가 일치하지 않습니다.";
    }
  });

  // 로그아웃 처리
  document.getElementById('logout-btn-student').addEventListener('click', logout);
  document.getElementById('logout-btn-admin').addEventListener('click', logout);

  function logout() {
    document.getElementById('login-form').reset();
    errorMsg.textContent = "";
    loginSection.classList.add('active');
    studentSection.classList.remove('active');
    adminSection.classList.remove('active');
    
    loginSection.classList.remove('hidden');
    studentSection.classList.add('hidden');
    adminSection.classList.add('hidden');
  }

  // --- 수강생 화면 렌더링 ---
  function showStudentDashboard(student) {
    loginSection.classList.remove('active');
    loginSection.classList.add('hidden');
    studentSection.classList.add('active');
    studentSection.classList.remove('hidden');

    document.getElementById('student-greeting').textContent = `${student.name} 훈련생 성적표`;
    
    const recordsContainer = document.getElementById('student-records');
    recordsContainer.innerHTML = ''; 

    let totalScore = 0;

    // 과목 최신순 정렬
    const sortedSubjects = [...student.subjects].reverse();

    sortedSubjects.forEach(sub => {
      totalScore += sub.score;
      const card = document.createElement('div');
      card.className = 'subject-card';
      card.innerHTML = `
        <div class="subject-header">
          <div>
            <div class="subject-title">${sub.name}</div>
            <div class="subject-date">${sub.date}</div>
          </div>
          <div class="subject-score">${sub.score}점</div>
        </div>
        <div class="subject-feedback">${sub.feedback}</div>
      `;
      recordsContainer.appendChild(card);
    });

    const avg = sortedSubjects.length > 0 ? (totalScore / sortedSubjects.length).toFixed(1) : 0;
    document.getElementById('student-average').textContent = `${avg}점`;
  }

  // --- 관리자 화면 렌더링 ---
  function showAdminDashboard() {
    loginSection.classList.remove('active');
    loginSection.classList.add('hidden');
    adminSection.classList.add('active');
    adminSection.classList.remove('hidden');

    const adminRecords = document.getElementById('admin-records');
    adminRecords.innerHTML = ''; 

    const sortedStudents = [...studentData].sort((a, b) => a.name.localeCompare(b.name));

    sortedStudents.forEach(student => {
      let total = 0;
      student.subjects.forEach(sub => total += sub.score);
      const avg = student.subjects.length > 0 ? (total / student.subjects.length).toFixed(1) : 0;

      const studentCard = document.createElement('div');
      studentCard.className = 'admin-student-card';
      
      const header = document.createElement('div');
      header.className = 'admin-student-header';
      header.innerHTML = `
        <span>${student.name} 훈련생 (비밀번호: ${student.password})</span>
        <span>평균: ${avg}점 ▼</span>
      `;

      const body = document.createElement('div');
      body.className = 'admin-student-body';
      
      const reversedSubjects = [...student.subjects].reverse();
      reversedSubjects.forEach(sub => {
        body.innerHTML += `
          <div class="subject-card" style="box-shadow:none; border:1px solid #eee;">
            <div class="subject-header">
              <div>
                <div class="subject-title">${sub.name}</div>
                <div class="subject-date">${sub.date}</div>
              </div>
              <div class="subject-score">${sub.score}점</div>
            </div>
            <div class="subject-feedback">${sub.feedback}</div>
          </div>
        `;
      });

      // 아코디언 토글
      header.addEventListener('click', () => {
        const isOpen = body.style.display === 'block';
        body.style.display = isOpen ? 'none' : 'block';
      });

      studentCard.appendChild(header);
      studentCard.appendChild(body);
      adminRecords.appendChild(studentCard);
    });
  }
});