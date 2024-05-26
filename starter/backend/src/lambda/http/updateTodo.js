import { updateTodo } from "../../businessLogic/todos.js"
import { getUserId } from "../utils.mjs"

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  const userId = getUserId(event)
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const updated = await updateTodo(todoId, userId, updatedTodo);
  if (!updated) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
