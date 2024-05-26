import { deleteTodo } from "../../businessLogic/todos.js"
import { getUserId } from "../utils.mjs"


export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  // TODO: Remove a TODO item by id
  if (!(await deleteTodo(userId,todoId))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    };
  }

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  };
}

