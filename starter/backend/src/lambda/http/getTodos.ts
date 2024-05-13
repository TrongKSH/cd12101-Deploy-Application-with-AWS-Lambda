import { getTodos } from '../../businessLogic/todo';
import {APIGatewayProxyEvent, APIGatewayProxyResult,APIGatewayProxyHandler} from 'aws-lambda';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { createLogger } from '../../utils/logger.mjs';


const logger = createLogger('getTodos');

export const handler : APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Processing GetTodos event...');
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: await getTodos(event)
    })
  };
}

// export const handler =middy()
// .use(
//   cors({
//     credentials: true
//   })
// )
// .handler(async (event)=> {
//   console.log('Caller event', event)
//   return {
//     statusCode: 200,
//     headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Credentials': true
//           },
//     body: JSON.stringify({
//       items: await getTodos(event)
//     })          
//   };
// })
