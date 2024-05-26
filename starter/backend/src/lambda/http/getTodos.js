import middy from '@middy/core';
import cors from '@middy/http-cors';
import { getUserId } from '../utils.mjs'
import { getTodosForUser } from '../../businessLogic/todos.js';
import { createLogger } from '../../utils/logger.mjs'


const baseHandler =  async (event)=> {
  // TODO: Get all TODO items for a current user
  const logger = createLogger('get todo')

  const userId = getUserId(event)
  const todos = await getTodosForUser(userId)
  logger.info(`${userId}`)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
}

export const handler = middy(baseHandler)
  .use(cors({
    credentials: true
  }));