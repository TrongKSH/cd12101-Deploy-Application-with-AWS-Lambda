
import AWS from 'aws-sdk'; 
import { createLogger } from '../utils/logger.mjs'; 

const logger = createLogger('AttachmentHelper'); 
const s3BucketName = process.env.AWS_BUCKET
// const urlExpiration = process.env.AWS_S3_SIGNED_URL_EXPIRATION

export class AttachmentHelper{
    constructor(
          s3 = new AWS.S3({ signatureVersion: 'v4'}),
          bucketName = s3BucketName
    ){
        this.s3 = s3;
        this.bucketName = bucketName
    }

getAttachmentUrl(todoId){
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}.png`
}

getUploadUrl(signedUrlRequest){

    var result = this.s3.getSignedUrl('putObject',signedUrlRequest)
    logger.info("atachmentHelper.getUploadUrl", result);

    return result;
}
}