console.log('AutoFill Pro content script loaded.');

// Utility: Fuzzy/partial match
function fuzzyMatch(str, keywords) {
  if (!str) return false;
  str = str.toLowerCase();
  return keywords.some(k => {
    k = k.toLowerCase();
    return str.includes(k) || k.includes(str) ||
      (str.replace(/[^a-z]/g, '').includes(k.replace(/[^a-z]/g, '')));
  });
}

// Get closest label or prompt for a field
function getFieldPrompt(field) {
  // 1. Associated <label for="...">
  if (field.labels && field.labels.length) {
    return field.labels[0].innerText.trim();
  }
  // 2. aria-label
  if (field.getAttribute('aria-label')) {
    return field.getAttribute('aria-label').trim();
  }
  // 3. placeholder
  if (field.getAttribute('placeholder')) {
    return field.getAttribute('placeholder').trim();
  }
  // 4. Parent text (e.g., <div>First Name <input ...></div>)
  let parent = field.parentElement;
  while (parent && parent !== document.body) {
    const text = parent.innerText.trim();
    if (text && text.length < 60) return text;
    parent = parent.parentElement;
  }
  return '';
}

// Map prompts to user data keys
const fieldMap = [
  { keys: ['full name', 'fullname', 'name'], data: 'fullName' },
  { keys: ['first name', 'firstname', 'given name'], data: 'firstName' },
  { keys: ['last name', 'lastname', 'surname', 'family name'], data: 'lastName' },
  { keys: ['email', 'e-mail'], data: 'email' },
  { keys: ['phone', 'mobile', 'phone number'], data: 'phone' },
  { keys: ['linkedin', 'linkedin profile'], data: 'linkedin' },
  { keys: ['location', 'city', 'address', 'location (city)'], data: 'location' },
  { keys: ['gender', 'gender identity'], data: 'gender' },
  { keys: ['veteran', 'veteran status', 'armed forces'], data: 'veteran' },
  { keys: ['resume', 'cv', 'resume/cv'], data: 'resume' },
  // Experience
  { keys: ['position', 'title', 'job title'], data: 'experience.position' },
  { keys: ['company', 'employer', 'organization'], data: 'experience.company' },
  { keys: ['from', 'start', 'start date'], data: 'experience.from' },
  { keys: ['to', 'end', 'end date'], data: 'experience.to' },
  { keys: ['description', 'responsibilities', 'summary'], data: 'experience.description' },
  // Education
  { keys: ['degree', 'qualification'], data: 'education.degree' },
  { keys: ['university', 'school', 'college', 'institution'], data: 'education.university' },
  { keys: ['from', 'start', 'start date'], data: 'education.from' },
  { keys: ['to', 'end', 'end date'], data: 'education.to' },
];

function getDataValue(data, key) {
  if (key.startsWith('experience.')) {
    const sub = key.split('.')[1];
    return data.experience && data.experience[0] ? data.experience[0][sub] : '';
  }
  if (key.startsWith('education.')) {
    const sub = key.split('.')[1];
    return data.education && data.education[0] ? data.education[0][sub] : '';
  }
  return data[key];
}

// Recursively get all fields in DOM and shadow DOMs
function getAllFields(root=document) {
  let fields = Array.from(root.querySelectorAll('input, select, textarea'));
  // Traverse shadow roots
  const traverse = (node) => {
    if (node.shadowRoot) {
      fields = fields.concat(Array.from(node.shadowRoot.querySelectorAll('input, select, textarea')));
      Array.from(node.shadowRoot.children).forEach(traverse);
    } else if (node.children) {
      Array.from(node.children).forEach(traverse);
    }
  };
  Array.from(root.children || []).forEach(traverse);
  return fields;
}

async function autofill() {
  chrome.storage.local.get(['autofillProData'], (result) => {
    const data = result.autofillProData;
    if (!data) return;
    const fields = getAllFields(document);
    fields.forEach(field => {
      // Skip file fields (handled below)
      if (field.type === 'file') return;
      const prompt = getFieldPrompt(field);
      let matched = false;
      for (const map of fieldMap) {
        if (fuzzyMatch(prompt, map.keys)) {
          const value = getDataValue(data, map.data);
          if (value) {
            if (field.tagName === 'SELECT') {
              // Try to match option
              for (const opt of field.options) {
                if (fuzzyMatch(opt.text, [value]) || fuzzyMatch(opt.value, [value])) {
                  field.value = opt.value;
                  break;
                }
              }
            } else if (field.type === 'radio' || field.type === 'checkbox') {
              if (fuzzyMatch(field.value, [value])) field.checked = true;
            } else {
              field.value = value;
            }
            field.style.background = '#e6fffa'; // highlight
            matched = true;
            break;
          }
        }
      }
    });
    // Resume upload (show prompt)
    const resumeFields = fields.filter(f => f.type === 'file' && fuzzyMatch(getFieldPrompt(f), ['resume', 'cv', 'resume/cv']));
    if (resumeFields.length && data.resume) {
      alert('Please upload your resume manually: ' + data.resume);
    }
  });
}

// Listen for popup trigger
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Received message:', msg);
  if (msg === 'autofill-now') {
    autofill();
    sendResponse('done');
  }
});

// MutationObserver to handle dynamic forms
const observer = new MutationObserver(() => {
  if (window._autofillTimeout) clearTimeout(window._autofillTimeout);
  window._autofillTimeout = setTimeout(autofill, 500);
});
observer.observe(document.body, { childList: true, subtree: true });

// Optionally, run autofill automatically on page load (uncomment to enable)
// window.addEventListener('load', autofill); 