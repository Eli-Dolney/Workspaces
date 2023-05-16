document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
  
    addTaskButton.addEventListener('click', function() {
      const task = taskInput.value.trim();
  
      if (task !== '') {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task');
  
        const taskText = document.createElement('span');
        taskText.textContent = task;
  
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Mark as Done';
        completeButton.addEventListener('click', function() {
          taskItem.classList.add('done');
        });
  
        taskItem.appendChild(taskText);
        taskItem.appendChild(completeButton);
        taskList.appendChild(taskItem);
  
        taskInput.value = '';
      }
    });
  
    // Get the modal
    var modal = document.getElementById("taskModal");
  
    // Get the button that opens the modal
    var btn = document.getElementById("openTasksButton");
  
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
  });
  
  // Get the button that opens the modal
var btn = document.getElementById("openTasksButton");

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}