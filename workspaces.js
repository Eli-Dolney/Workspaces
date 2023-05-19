document.addEventListener('DOMContentLoaded', function() {
    const workspaceNameInput = document.getElementById('workspaceName');
    const createWorkspaceButton = document.getElementById('createWorkspace');
    const workspacesContainer = document.getElementById('workspacesContainer');
  
    createWorkspaceButton.addEventListener('click', function() {
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
  
    // Your existing workspaces functions go here
    // addWorkspaceToUI(), addBookmark(), openWorkspace(), etc.
  
    // Get the modal
    var modal = document.getElementById("workspaceModal");
  
    // Get the button that opens the modal
    var btn = document.getElementById("openWorkspacesButton");
  
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
  
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
      modal.style.display = "block";
    }
  
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    // Get the <span> element that closes the modal
var spanTasks = document.getElementsByClassName("close")[0];
var spanWorkspaces = document.getElementsByClassName("close")[1];

// When the user clicks on <span> (x), close the modal
spanTasks.onclick = function() {
  taskModal.style.display = "none";
}
spanWorkspaces.onclick = function() {
  workspaceModal.style.display = "none";
}

  
    // Load existing workspaces on startup
    updateUI();
  });
  