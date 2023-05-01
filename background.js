chrome.commands.onCommand.addListener((command) => {
    if (command === 'open_workspace_manager') {
      chrome.tabs.create({ url: 'window.html' });
    }
  });
  
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'window.html' });
  });