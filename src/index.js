import inquirer from 'inquirer';
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

/*const result = await inquirer
    .prompt([
        {
            name: 'task',
            message: 'Add new task',
        }
    ]);

const filePath = './storage/tasks.json';

function readTasks() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
}

const tasks = readTasks();
tasks.push({ id: uuidv4(), 'task': result.task, 'done': false });
fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
console.log("Task added!");

list();

function list() {
    const tasks = readTasks();
    for (const tasksKey in tasks) {
        console.log(tasks[tasksKey]['task'])
    }
}*/

async function start(filePath) {
    const result = await inquirer
        .prompt([
            {
                type: 'list',
                message: 'Choose the query',
                name: 'querySelected',
                choices: [
                    'Add',
                    'List',
                    'Update',
                    'Delete'
                ]
            }
        ]);

    switch (result.querySelected) {
        case 'Add':
            addInTask();
            break;
        case 'List':
            console.log("list");
            break;
        case 'Update':
            console.log("update");
            break;
        case 'Delete':
            console.log("delete");
            break;
        default: 'No query selected';
    }



    function readTasks() {
        if (!fs.existsSync(filePath)) return [];
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data || "[]");
    }

    async function addInTask() {
        const result = await inquirer
            .prompt([
                {
                    name: 'task',
                    message: 'Add a task',
                }
            ]);

        const tasks = readTasks();
        tasks.push({id: uuidv4(), 'task': result.task, 'done': false});
        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
        console.log("Task added!");
    }

    function listTask() {
        console.log('oh so u to want');
    }

    function updateTask() {
        console.log('oh so u to want');
    }

    function deleteTask() {
        console.log('oh so u to want');
    }
}

let filePath = './storage/tasks.json';

start(filePath);
















// const filePath = './storage/user.json';
//
// fs.readFile(filePath, 'utf-8', function(err, data) {
//     let arrayOfObjects = JSON.parse(data)
//     arrayOfObjects.users = arrayOfObjects.users ?? [];
//     arrayOfObjects.users.push(result)
//
//     fs.writeFile(filePath, JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
//         if (err) throw err
//         console.log('Done!')
//     })
// });