chrome.commands.onCommand.addListener((command) => {
    if (command === 'open_workspace_manager') {
      chrome.tabs.create({ url: 'workspace_manager.html' });
    }
  });
  
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'workspace_manager.html' });
  });