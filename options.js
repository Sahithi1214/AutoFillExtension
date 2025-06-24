console.log('AutoFill Pro options page loaded.');
// TODO: Implement options UI and storage logic. 

// Modern Options Page for AutoFill Pro
const root = document.getElementById('root');

const defaultData = {
  fullName: '',
  firstName: '',
  lastName: '',
  location: '',
  email: '',
  phone: '',
  linkedin: '',
  gender: '',
  veteran: '',
  resume: '', // file name or base64
  experience: [],
  education: []
};

function renderOptionsPage(data) {
  root.innerHTML = `
    <h1>AutoFill Pro Settings</h1>
    <form id="autofill-form">
      <section>
        <h2>Personal Info</h2>
        <label>Full Name <input type="text" name="fullName" value="${data.fullName || ''}" required></label>
        <div class="flex-row">
          <label>First Name <input type="text" name="firstName" value="${data.firstName || ''}"></label>
          <label>Last Name <input type="text" name="lastName" value="${data.lastName || ''}"></label>
        </div>
        <label>Location <input type="text" name="location" value="${data.location || ''}"></label>
        <label>Email <input type="email" name="email" value="${data.email || ''}" required></label>
        <label>Phone Number <input type="tel" name="phone" value="${data.phone || ''}"></label>
        <label>LinkedIn Profile <input type="url" name="linkedin" value="${data.linkedin || ''}"></label>
        <label>Resume <input type="file" name="resume" accept=".pdf,.doc,.docx"></label>
        ${data.resume ? `<div>Current Resume: <span>${data.resume}</span></div>` : ''}
      </section>
      <section>
        <h2>Selections</h2>
        <label>Gender
          <select name="gender">
            <option value="">Select</option>
            <option value="Male" ${data.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Female" ${data.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option value="Other" ${data.gender === 'Other' ? 'selected' : ''}>Other</option>
            <option value="Prefer not to say" ${data.gender === 'Prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
          </select>
        </label>
        <label>Veteran Status
          <select name="veteran">
            <option value="">Select</option>
            <option value="Yes" ${data.veteran === 'Yes' ? 'selected' : ''}>Yes</option>
            <option value="No" ${data.veteran === 'No' ? 'selected' : ''}>No</option>
            <option value="Prefer not to say" ${data.veteran === 'Prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
          </select>
        </label>
      </section>
      <section id="experience-section">
        <h2>Experience <button type="button" class="add-btn" id="add-exp">+ Add</button></h2>
        <div id="exp-list"></div>
      </section>
      <section id="education-section">
        <h2>Education <button type="button" class="add-btn" id="add-edu">+ Add</button></h2>
        <div id="edu-list"></div>
      </section>
      <button type="submit">Save</button>
      <span id="save-msg" style="margin-left:16px;color:#38a169;display:none;">Saved!</span>
    </form>
  `;
  renderExpList(data.experience);
  renderEduList(data.education);
  addFormListeners(data);
}

function renderExpList(exps) {
  const expList = document.getElementById('exp-list');
  expList.innerHTML = '';
  exps.forEach((exp, i) => {
    const div = document.createElement('div');
    div.style.marginBottom = '18px';
    div.innerHTML = `
      <div class="flex-row">
        <label>Position <input type="text" name="exp-position-${i}" value="${exp.position || ''}"></label>
        <label>Company <input type="text" name="exp-company-${i}" value="${exp.company || ''}"></label>
      </div>
      <div class="flex-row">
        <label>From <input type="text" name="exp-from-${i}" value="${exp.from || ''}" placeholder="YYYY-MM"></label>
        <label>To <input type="text" name="exp-to-${i}" value="${exp.to || ''}" placeholder="YYYY-MM or Present"></label>
      </div>
      <label>Description <textarea name="exp-desc-${i}">${exp.description || ''}</textarea></label>
      <button type="button" class="remove-btn" data-exp="${i}">Remove</button>
      <hr>
    `;
    expList.appendChild(div);
  });
}

function renderEduList(edus) {
  const eduList = document.getElementById('edu-list');
  eduList.innerHTML = '';
  edus.forEach((edu, i) => {
    const div = document.createElement('div');
    div.style.marginBottom = '18px';
    div.innerHTML = `
      <div class="flex-row">
        <label>Degree <input type="text" name="edu-degree-${i}" value="${edu.degree || ''}"></label>
        <label>University <input type="text" name="edu-university-${i}" value="${edu.university || ''}"></label>
      </div>
      <div class="flex-row">
        <label>From <input type="text" name="edu-from-${i}" value="${edu.from || ''}" placeholder="YYYY-MM"></label>
        <label>To <input type="text" name="edu-to-${i}" value="${edu.to || ''}" placeholder="YYYY-MM or Present"></label>
      </div>
      <button type="button" class="remove-btn" data-edu="${i}">Remove</button>
      <hr>
    `;
    eduList.appendChild(div);
  });
}

function addFormListeners(data) {
  document.getElementById('add-exp').onclick = () => {
    data.experience.push({ position: '', company: '', from: '', to: '', description: '' });
    renderOptionsPage(data);
  };
  document.getElementById('add-edu').onclick = () => {
    data.education.push({ degree: '', university: '', from: '', to: '' });
    renderOptionsPage(data);
  };
  document.querySelectorAll('button.remove-btn[data-exp]').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-exp'));
      data.experience.splice(idx, 1);
      renderOptionsPage(data);
    };
  });
  document.querySelectorAll('button.remove-btn[data-edu]').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-edu'));
      data.education.splice(idx, 1);
      renderOptionsPage(data);
    };
  });
  document.getElementById('autofill-form').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    // Personal Info
    data.fullName = formData.get('fullName');
    data.firstName = formData.get('firstName');
    data.lastName = formData.get('lastName');
    data.location = formData.get('location');
    data.email = formData.get('email');
    data.phone = formData.get('phone');
    data.linkedin = formData.get('linkedin');
    // Selections
    data.gender = formData.get('gender');
    data.veteran = formData.get('veteran');
    // Resume
    const resumeFile = formData.get('resume');
    if (resumeFile && resumeFile.size > 0) {
      // Store file name and base64 (for demo, real extension may use only name or ask user to upload manually)
      const reader = new FileReader();
      reader.onload = function() {
        data.resume = resumeFile.name;
        data.resumeData = reader.result;
        saveData(data);
      };
      reader.readAsDataURL(resumeFile);
      document.getElementById('save-msg').style.display = 'inline';
      setTimeout(() => document.getElementById('save-msg').style.display = 'none', 2000);
      return;
    }
    // Experience
    data.experience = [];
    let i = 0;
    while (formData.has(`exp-position-${i}`)) {
      data.experience.push({
        position: formData.get(`exp-position-${i}`),
        company: formData.get(`exp-company-${i}`),
        from: formData.get(`exp-from-${i}`),
        to: formData.get(`exp-to-${i}`),
        description: formData.get(`exp-desc-${i}`)
      });
      i++;
    }
    // Education
    data.education = [];
    i = 0;
    while (formData.has(`edu-degree-${i}`)) {
      data.education.push({
        degree: formData.get(`edu-degree-${i}`),
        university: formData.get(`edu-university-${i}`),
        from: formData.get(`edu-from-${i}`),
        to: formData.get(`edu-to-${i}`)
      });
      i++;
    }
    saveData(data);
    document.getElementById('save-msg').style.display = 'inline';
    setTimeout(() => document.getElementById('save-msg').style.display = 'none', 2000);
  };
}

function saveData(data) {
  chrome.storage.local.set({ autofillProData: data });
}

function loadData() {
  chrome.storage.local.get(['autofillProData'], (result) => {
    const data = result.autofillProData || JSON.parse(JSON.stringify(defaultData));
    renderOptionsPage(data);
  });
}

document.addEventListener('DOMContentLoaded', loadData); 