import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger.mjs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const logger = createLogger('TodosAccess')


export default class TodosAccess {
    constructor(
        docClient = DynamoDBDocumentClient.from(new DynamoDBClient({region: 'us-east-1'})),
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

    async getAllTodos(userId) {

        const params = {
            TableName: this.todosTable,
            // IndexName: this.todosUserIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        };
        logger.info(`Query params: ${JSON.stringify(params)}`);

        try {
            const result = await this.docClient.send(new QueryCommand(params));
            logger.info(`Query result: ${JSON.stringify(result)}`);

            const items = result.Items;
            logger.info(`Fetched items: ${JSON.stringify(items)}`);

            if (!result.Items || result.Items.length === 0) {
                logger.info('No items found for the given userId');
            }

            return items;
        } catch (error) {
            logger.error('Error getting todo items', error);
            throw error;
        }
    }

    async getTodoByTodoId (userId, todoId){
        const params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        };
        logger.info(`Query params call get TodoByTodoId: ${JSON.stringify(params)}`);
        try {
            const result = await this.docClient.send(new GetCommand(params));
            logger.info(`Query result: ${JSON.stringify(result)}`);

            const items = result.Item;
            logger.info(`Fetched items: ${JSON.stringify(items)}`);

            if (!result.Item || result.Item.length === 0) {
                logger.info('No items found for the given userId');
            }

            return items;
        } catch (error) {
            logger.error('Error getting todo items', error);
            throw error;
        }
    }


    async updateTodoItem(todoId, userId, updatedAttributes) {
        const params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'SET #name = :name, #dueDate = :dueDate , #done = :done',
            ExpressionAttributeNames: {
                '#name': 'name', 
                '#dueDate': 'dueDate', 
                '#done': 'done'  

            },
            ExpressionAttributeValues: {
                ':name': updatedAttributes.name,
                ':dueDate': updatedAttributes.dueDate,
                ':done': updatedAttributes.done
            },
            ReturnValues: 'ALL_NEW' 
        };

        try {
            const result = await this.docClient.send(new UpdateCommand(params));
            logger.info('Todo item updated', result);
            return result.Attributes;
        } catch (error) {
            logger.error('Error updating todo item', error);
            throw error;
        }
    }

    async deleteTodoItem(todoId, userId) {
        logger.info('Delete todo item function called');

        const params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        };

        try {
            const result = await this.docClient.send(new DeleteCommand(params));
            logger.info('Todo item deleted', result);
            return result;
        } catch (error) {
            logger.error('Error deleting todo item', error);
            throw error;
        }
    }


    async updateAttachmentInDB (todoId, userId, atachementUrl){
        const params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'SET #attachmentUrl = :a',
            
            ExpressionAttributeValues: {
                ':a': atachementUrl
            },
            ExpressionAttributeNames: {
                '#attachmentUrl': 'attachmentUrl'
              }
            };

        try {
            const result = await this.docClient.send(new UpdateCommand(params));
            logger.info('Todo item updated', result);
            return result.Attributes;
        } catch (error) {
            logger.error('Error updating todo item', error);
            throw error;
        }
    }
}

