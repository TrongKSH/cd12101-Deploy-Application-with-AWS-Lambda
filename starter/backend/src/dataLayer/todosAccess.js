import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger.mjs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'

// const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')


// const dynamoDb = new DynamoDB()
// const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb)
// const dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)

// export default class TodosAccess {
//     constructor(
//     // docClient = new XAWS.DynamoDB.DocumentClient(),
//     docClient = DynamoDBDocument.from(new DynamoDB()),
//     todosTable = process.env.AWS_DB_APP_TABLE,
//     todosUserIndex = process.env.AWS_DB_INDEX_NAME
//   ) {
//     this.docClient = docClient
//     this.todosTable = todosTable
//     this.todosUserIndex = todosUserIndex
//   }

//   async createTodoItem(todoItem) {
//     logger.info('Create todo item function called')

//     const result = await this.docClient
//       .put({
//         TableName: this.todosTable,
//         Item: todoItem
//       })
//       .promise()
//     logger.info('Todo item created', result)
//     return todoItem
//   }
// }

export default class TodosAccess {
    constructor(
        docClient = DynamoDBDocumentClient.from(new DynamoDBClient()),
        todosTable = process.env.AWS_DB_APP_TABLE,
        todosUserIndex = process.env.AWS_DB_INDEX_NAME
    ) {
        this.docClient = docClient;
        this.todosTable = todosTable;
        this.todosUserIndex = todosUserIndex;
    }

    async createTodoItem(todoItem) {
        logger.info('Create todo item function called');

        const params = {
            TableName: this.todosTable,
            Item: todoItem
        };

        try {
            const result = await this.docClient.send(new PutCommand(params));
            logger.info('Todo item created', result);
            return todoItem;
        } catch (error) {
            logger.error('Error creating todo item', error);
            throw error;
        }
    }
}