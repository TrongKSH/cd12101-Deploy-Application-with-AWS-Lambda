import { createAttachmentPresignedUrl } from "../../businessLogic/todos.js"
import { getUserId } from "../utils.mjs"


export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
const url = await createAttachmentPresignedUrl(todoId,userId)
return {
  statusCode: 201,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    uploadUrl: url
  })
}
}

