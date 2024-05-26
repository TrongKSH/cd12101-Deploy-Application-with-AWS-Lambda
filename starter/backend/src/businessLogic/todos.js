import { createLogger } from '../utils/logger.mjs'
import * as uuid from 'uuid'
import TodosAccess from '../dataLayer/todosAccess.js'
import { AttachmentHelper } from '../dataLayer/attachmentHelper.js'

const logger = createLogger('todo business logic')
const todosAccess = new TodosAccess() 
const attachmentHelper = new AttachmentHelper();

export async function createTodo(newTodo, userId) {
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
  return await todosAccess.createTodoItem(newItem)
}

export async function getTodosForUser(userId) {
  logger.info(`Get todo for user function called for ${userId}`)
  return await todosAccess.getAllTodos(userId)
}

export async function updateTodo(userId, todoId, updatedTodo) {
  logger.info(
    `Update todo function called for todoId: ${todoId}, userId: ${userId}`
  )
  return await todosAccess.updateTodoItem(userId, todoId, updatedTodo)
}

export async function deleteTodo(userId, todoId) {
  logger.info(
    `Delete todo function called for todoId: ${todoId}, userId: ${userId}`
  )
  return await todosAccess.deleteTodoItem(todoId, userId)
}

export async function createAttachmentPresignedUrl(todoId,userId){
    const bucketName = attachmentHelper.bucketName
    const urlExpiration = process.env.AWS_S3_SIGNED_URL_EXPIRATION

    const attachmentUrl = attachmentHelper.getAttachmentUrl(todoId)

    const signedUrlRequest= {
        Bucket: bucketName,
        Key: `${todoId}.png`,
        Expires: Number(urlExpiration)
    }
    
    logger.info('Create attachment function called');

    var result =  attachmentHelper.getUploadUrl(signedUrlRequest);
    logger.info(`call attachmentHelper.getPresignedUploadURL  ${result}`);

    if(!(await todosAccess.getTodoByTodoId(userId,todoId))){
        return false
    }
    logger.info(`${todoId} :: ${userId} :: ${attachmentUrl}`);
    await todosAccess.updateAttachmentInDB(todoId,userId,attachmentUrl)
    return result

}
