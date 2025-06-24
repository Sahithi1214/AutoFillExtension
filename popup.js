console.log('AutoFill Pro popup loaded.');
// TODO: Implement popup autofill trigger logic. 

document.getElementById('autofill-btn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, 'autofill-now', (response) => {
        window.close();
      });
    }
  });
}); 