document.addEventListener('DOMContentLoaded', () => {
  const createWorkspaceBtn = document.getElementById('createWorkspace');
  const workspaceNameInput = document.getElementById('workspaceName');
  const workspacesContainer = document.getElementById('workspacesContainer');

  createWorkspaceBtn.addEventListener('click', () => {
    createWorkspace(workspaceNameInput.value);
    workspaceNameInput.value = '';
  });

  function createWorkspace(name) {
    if (name.trim() === '') {
      return;
    }

    const workspace = {
      name,
      bookmarks: [],
    };

    chrome.storage.sync.get({ workspaces: [] }, (data) => {
      data.workspaces.push(workspace);
      chrome.storage.sync.set({ workspaces: data.workspaces }, () => {
        addWorkspaceToUI(workspace);
      });
    });
  }

  function addWorkspaceToUI(workspace) {
    const workspaceDiv = document.createElement('div');
    workspaceDiv.classList.add('workspace');

    const workspaceTitle = document.createElement('h2');
    workspaceTitle.innerText = workspace.name;

    const bookmarkUrlInput = document.createElement('input');
    bookmarkUrlInput.type = 'text';
    bookmarkUrlInput.classList.add('bookmarkUrl');
    bookmarkUrlInput.placeholder = 'Enter URL';

    const addBookmarkBtn = document.createElement('button');
    addBookmarkBtn.innerText = 'Add Bookmark';
    addBookmarkBtn.addEventListener('click', () => {
      addBookmark(workspace.name, bookmarkUrlInput.value);
      bookmarkUrlInput.value = '';
    });

    const openWorkspaceBtn = document.createElement('button');
    openWorkspaceBtn.innerText = 'Open Workspace';
    openWorkspaceBtn.addEventListener('click', () => {
      openWorkspace(workspace.name);
    });

    const deleteWorkspaceBtn = document.createElement('button');
    deleteWorkspaceBtn.innerText = 'Delete Workspace';
    deleteWorkspaceBtn.addEventListener('click', () => {
      deleteWorkspace(workspace.name);
    });

    workspaceDiv.appendChild(workspaceTitle);
    workspaceDiv.appendChild(bookmarkUrlInput);
    workspaceDiv.appendChild(addBookmarkBtn);
    workspaceDiv.appendChild(openWorkspaceBtn);
    workspaceDiv.appendChild(deleteWorkspaceBtn);

    // Add bookmarks list
    const bookmarksList = document.createElement('ol');  // Changed from 'ul' to 'ol'
    bookmarksList.classList.add('bookmarksList');
    workspace.bookmarks.forEach((bookmark, index) => {
      const bookmarkItem = document.createElement('li');
      bookmarkItem.classList.add('bookmarkItem');  // Add a new class here
      const shortenedUrl = new URL(bookmark.url).hostname;
      bookmarkItem.textContent = shortenedUrl;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        removeBookmark(workspace.name, index);
      });

      bookmarkItem.appendChild(removeBtn);
      bookmarksList.appendChild(bookmarkItem);
    });
    workspaceDiv.appendChild(bookmarksList);
    workspacesContainer.appendChild(workspaceDiv);
  }

  function addBookmark(workspaceName, url) {
    if (!url) {
      return;
    }
  
    chrome.storage.sync.get({ workspaces: [] }, (data) => {
      const targetWorkspace = data.workspaces.find((workspace) => workspace.name === workspaceName);
      targetWorkspace.bookmarks.push({ url });
      chrome.storage.sync.set({ workspaces: data.workspaces }, updateUI);
    });
  }

  function openWorkspace(workspaceName) {
    chrome.storage.sync.get({ workspaces: [] }, (data) => {
      const targetWorkspace = data.workspaces.find((workspace) => workspace.name === workspaceName);

      // Open bookmarks in a new window
      const urls = targetWorkspace.bookmarks.map((bookmark) => bookmark.url);
      chrome.windows.create({ url: urls });
    });
  }

  function removeBookmark(workspaceName, bookmarkIndex) {
    chrome.storage.sync.get({ workspaces: [] }, (data) => {
      const targetWorkspace = data.workspaces.find((workspace) => workspace.name === workspaceName);
      targetWorkspace.bookmarks.splice(bookmarkIndex, 1);
      chrome.storage.sync.set({ workspaces: data.workspaces }, updateUI);
    });
  }

  function deleteWorkspace(workspaceName) {
    chrome.storage.sync.get({ workspaces: [] }, (data) => {
      data.workspaces = data.workspaces.filter((workspace) => workspace.name !== workspaceName);
      chrome.storage.sync.set({ workspaces: data.workspaces }, updateUI);
    });
  }

  function updateUI() {
    // Remove all workspace divs
    while (workspacesContainer.firstChild) {
      workspacesContainer.firstChild.remove();
    }

    // Load existing workspaces
    chrome.storage.sync.get({ workspaces: [] }, (data) => {
      data.workspaces.forEach((workspace, index) => {
        addWorkspaceToUI(workspace, index + 1);
      });
    });
  }

  // Load existing workspaces on startup
  updateUI();

  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('change', toggleTheme);

  function toggleTheme() {
    const body = document.body;

    if (themeToggle.checked) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    }
  }
});
