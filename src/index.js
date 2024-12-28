import inquirer from 'inquirer';
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { input } from '@inquirer/prompts';

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
            await addInTask();
            break;
        case 'List':
            listTask();
            break;
        case 'Update':
            await updateTask();
            break;
        case 'Delete':
            await deleteTask();
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

        if (!result.task.trim()) {
            console.log("Task description cannot be empty");
            await addInTask();
            return;
        }

        const tasks = readTasks();
        tasks.push({id: uuidv4(), 'task': result.task, 'done': false});
        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
        console.log("Task added!");
    }

    function listTask() {
       console.table(readTasks());
    }

    async function updateTask() {
        let tasks =  readTasks();

        const choiceMap = new Map();

        const choices = tasks.map(item => {
            const taskName = item.task;
            // Count occurrences of this task
            const count = choiceMap.get(taskName) || 0;
            choiceMap.set(taskName, count + 1);

            // Only add number if it's a duplicate
            const displayName = count > 0 ? `${taskName} (${count + 1})` : taskName;

            return {
                name: displayName,  // What user sees
                value: item.id      // What gets returned when selected
            };
        });

        const result = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectedTaskId',
                    message: 'choose a task to update',
                    choices: choices
                }
            ]);

        const selectedTaskObject = readTasks().find(item => item.id === result.selectedTaskId);

        const answers = {
            updatedValue: await input({ message: selectedTaskObject.task }),
        };

        const newTaskDescription = answers.updatedValue;

        if (!answers.updatedValue.trim()) {
            console.log("Task description cannot be empty");
            return;
        }

        const { confirmed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: `Update task from "${selectedTaskObject.task}" to "${newTaskDescription}"?`,
                default: false
            }
        ]);

        if (!confirmed) {
            console.log("Update cancelled");
            return;
        }

        tasks = tasks.map(element =>
            element.id === result.selectedTaskId
                ? { ...element, task: newTaskDescription }
                : element
        );

        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
        console.log("Updated successfully");
    }

    async function deleteTask() {
        let tasks = readTasks();

        const choices = tasks.map(item => {
            return {
                name: item.task,  // What user sees
                value: item.id      // What gets returned when selected
            };
        });

        const result = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectedTaskId',
                    message: 'choose a task to delete',
                    choices: choices
                }
            ]);


        const { confirmed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: `Are you sure to delete?`,
                default: false
            }
        ]);

        if (!confirmed) {
            console.log("Delete cancelled");
            return;
        }

        const selectedTask = tasks.findIndex(item => item.id === result.selectedTaskId);

        if(tasks !== -1) {
            tasks.splice(selectedTask, 1);
        }

        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
        console.log("Deleted successfully");
    }
}

let filePath = './storage/tasks.json';

start(filePath);