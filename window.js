document.getElementById('openWindow').addEventListener('click', () => {
    chrome.windows.create({
      url: 'window.html',
      type: 'popup',
      width: 400,
      height: 600
    });
  });
  
  chrome.storage.sync.get({ themeMode: 'light' }, (data) => {
    if (data.themeMode === 'dark') {
      themeToggle.checked = true;
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    }
  });
  
  themeToggle.addEventListener('change', () => {
    const themeMode = themeToggle.checked ? 'dark' : 'light';
    chrome.storage.sync.set({ themeMode });
  });
  