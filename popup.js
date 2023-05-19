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
 
   
  // Grab the sidebar and the button that controls it
const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.getElementById('sidebar-btn');

// Add event listeners for opening and closing the sidebar
sidebarBtn.addEventListener('click', openNav);
sidebar.querySelector('.closebtn').addEventListener('click', closeNav);

function openNav() {
  sidebar.style.width = '250px';  // Adjust as necessary
  document.getElementById('main').style.marginLeft = '250px';  // Adjust as necessary
}

function closeNav() {
  sidebar.style.width = '0';
  document.getElementById('main').style.marginLeft = '0';
}


   let is24HourFormat = true;

   document.getElementById('toggleTimeFormat').addEventListener('click', () => {
       is24HourFormat = !is24HourFormat;
       displayTime();
   });
 
   function displayTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    let timeFormat = 'AM';
 
    if (!is24HourFormat) {
        if (hours >= 12) {
            if(hours > 12) // Convert to 12-hour format
                hours -= 12;
            timeFormat = 'PM';
        } else if (hours === 0) {
            hours = 12; // Replace 0 with 12 in 12-hour time format
        }
    }

    const timeWidget = document.getElementById("timeWidget");

window.onpointermove = event => { 
  const { clientX, clientY } = event;
  
  timeWidget.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards" });
}
 
    document.getElementById('currentTime').innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` + (is24HourFormat ? '' : ` ${timeFormat}`);
 }
 
   // Call displayTime every second
   setInterval(displayTime, 1000);
 
   // Display the time immediately on page load
   displayTime();
   
 });
 
