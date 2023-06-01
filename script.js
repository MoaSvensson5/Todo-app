//start the id at 1
let todoId = 1;

function addTodo() {
    let titleInput = document.getElementById('titleInput').value;
    let descriptionInput = document.getElementById('descriptionInput').value;
    let date = new Date();
    
    //exclude some unusual characters
    if (titleInput.trim() === "" || descriptionInput.trim() === "") {
        alert("Please enter a to-do")
        return;
    }
    if (!/^[a-öA-Ö0-9\s.,!?]+$/.test(titleInput)) {
        alert("Please enter a valid todo title. Only letters, numbers, and . , ! ? are allowed.");
        return;
    }
    if (!/^[a-öA-Ö0-9\s.,!?]+$/.test(descriptionInput)) {
        alert("Please enter a valid todo description. Only letters, numbers, and . , ! ? are allowed.");
        return;
    }
    
    fetch('https://dummyjson.com/todos/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: titleInput,
        completed: false,
        userId: 1,
      })
    })
    .then(res => res.json())
    .then(data => {
        data.id = todoId++; //for every todo the id increase with 1 to get an unique id
        let newTodo = document.createElement('li');
        let day = date.getDate();
        let month = date.getMonth() + 1; // Month is zero-based, so I add 1
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let formattedDate = `${day}/${month} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        newTodo.innerHTML = `
        <input type="checkbox" id="checkbox" name="todo" value="${data.id}">
        <strong>${data.todo}</strong>
        ${descriptionInput}
        <date>created: ${formattedDate}</date>
        <span class="close"><i class="fas fa-trash"></i></span>`;


    //added event listener to the delete bin
    let deleteButton = newTodo.querySelector('.close');
    deleteButton.addEventListener('click', deleteTodo);

    //added event listener to the checkbox
    let moveButton = newTodo.querySelector("#checkbox");
    moveButton.addEventListener("click", moveTodo);
    document.getElementById('undone').appendChild(newTodo);

    //clear the input fields after the todo is submitted
    document.getElementById('titleInput').value = "";
    document.getElementById('descriptionInput').value = "";
    });
}


function moveTodo() {
    let checkbox = this;
    let id = checkbox.value;
    let completed = Boolean(checkbox.checked);
    let date = new Date();

    fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: completed,
        })
    })
    .then(res => res.json())
    .then(() => {
        let todoItem = checkbox.parentNode;
        let undoneList = document.getElementById('undone');
        let doneList = document.getElementById('done');

        if (completed) {
            // Move the todo from 'undone' to 'done' adn change created to completed
            undoneList.removeChild(todoItem);
            doneList.appendChild(todoItem);
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let formattedDate = `${day}/${month} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            let dateElement = todoItem.querySelector("date");
            dateElement.textContent = `completed: ${formattedDate}`;
        } else {
            // I want the user to be able to move the todo back to undone, but then the created date will be deleted
            doneList.removeChild(todoItem);
            undoneList.appendChild(todoItem);
            let dateElement = todoItem.querySelector("date");
            dateElement.textContent = "";
        }
    });
}


function deleteTodo() {
    let span = this;
    let newTodo = span.parentNode;
    let id = newTodo.querySelector('input[type="checkbox"]').value;

    fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'DELETE',
    })
    .then(() => {
        newTodo.remove();
    })
    .catch(error => {
        console.log('Error deleting todo:', error);
    });
}