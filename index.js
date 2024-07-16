const inquirer = require('inquirer');
const { readFile, writeFile } = require('fs').promises;
const uuid = require('uuid');

async function getToDoData() {
    try {
        const data = await readFile('./db/todos.json', 'utf-8');
        return JSON.parse(data); // Ensure we return parsed JSON data
    } catch (error) {
        console.error('Error reading todos.json:', error);
        return []; // Return an empty array in case of error
    }
}

async function saveToDoData(updatedTodos) {
    try {
        await writeFile('./db/todos.json', JSON.stringify(updatedTodos, null, 2));
        console.log('ToDos saved successfully!');
    } catch (error) {
        console.error('Error saving todos.json:', error);
    }
}

function showMainMenu() {
    return inquirer.prompt({
        name: 'menuChoice',
        message: 'Please select an option',
        type: 'list',
        choices: ['Add a ToDo', 'Mark a ToDo complete', 'Exit']
    });
}

async function addTodo() {
    // Get the todo text from the user
    const { todoText } = await inquirer.prompt({
        name: 'todoText',
        message: 'Type the text for your ToDo'
    });

    // Get the data from the todos.json file
    const todosArray = await getToDoData();

    // Add the todo to the array
    const todoObj = {
        id: uuid.v4(),
        text: todoText,
        completed: false
    };
    todosArray.push(todoObj);

    // Save the updated array back to the file
    await saveToDoData(todosArray);
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
        .then(async (menuAnswerObj) => {
            switch (menuAnswerObj.menuChoice) {
                case 'Add a ToDo':
                    await addTodo();
                    break;
                case 'Mark a ToDo complete':
                    // Implement markComplete logic here
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    process.exit();
            }

            // Recursively call init to show the menu again
            init();
        })
        .catch(error => {
            console.error('Error showing main menu:', error);
        });
}

init();
