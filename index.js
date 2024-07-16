const inquirer = require('inquirer'); // Default import - That value from the package files that you are importing is not exported through an export object
const { readFile, writeFile } = require('fs').promises;
const uuid = require('uuid');

function getToDoData() {
    return readFile('./db/todos.json', 'utf-8')
        .catch((error) => {
            console.log(error);
        });
}

//TODO markComplete(todo){}
function markComplete(todoObj){
    
}

//save todo data
function saveToDoData(updatedTodos) {
    return writeFile('./db/todos.json', JSON.stringify(updatedTodos));
}

function showMainMenu() {
    return inquirer.prompt({
        name: 'menuChoice',
        message: 'Please select an option',
        // Output a list of options - the user can select one
        type: 'list',
        choices: ['Add a ToDo', 'Mark a ToDo complete', 'Exit']
    });
}

function addTodo() {
    // Get the todo text from the user
    return inquirer.prompt({
        name: 'todoText',
        message: 'Type the text for your ToDo'
    }).then((addTodoAnswerObj) => {
        // get the data from the todos.json file
        return getToDoData()
            .then(todosArray => {
                // Add the todo to a database
                const todoObj = {
                    id: uuid.v4(),
                    text: addTodoAnswerObj.todoText,
                    completed: false
                }
                todosArray.push(todoObj);
                return saveToDoData(todosArray)
                    .then(() => {
                        console.log('ToDos saved successfully!')
                    })
            })

    })
}

function init() {
    // Show a welcome message
    console.log(`
  -----------
  Welcome to the ToDo Wiz
  -----------
  `);

    // Show the menu options
    showMainMenu()
        .then((menuAnswerObj) => {
            switch (menuAnswerObj.menuChoice) {
                case 'Add a ToDo':
                    addTodo()
                        .then(() => {

                        });
            }
        })
}

init();