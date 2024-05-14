import { createLogger } from '../utils/logger.mjs'
import * as uuid from 'uuid'
import TodosAccess from '../dataLayer/todosAccess.js';

const logger = createLogger('TodosAccess')

export async function createTodo(
    newTodo,
    userId
){
    logger.info('Create todo function called')

    const todoId = uuid.v4()
    const createAt = new Date().toISOString()
    const newItem = {
        userId,
        todoId,
        createAt,
        done: false,
        ...newTodo
    }
    const todosAccess = new TodosAccess(); // Instantiate TodosAccess class
    return await todosAccess.createTodoItem(newItem)
}