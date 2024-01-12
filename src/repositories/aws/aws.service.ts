import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AWSService {
  AWS_S3_BUCKET: string = process.env.BUCKET_NAME;

  s3Client = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
      secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    },
  });

  async s3_upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ): Promise<PutObjectCommandOutput | null> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
    };

    try {
      const s3Response = await this.s3Client.send(new PutObjectCommand(params));
      return s3Response;
    } catch (e) {
      return null;
    }
  }

  async s3_getObject(bucket: string, name: string): Promise<string | null> {
    const params = {
      Bucket: bucket,
      Key: String(name),
    };

    try {
      // presign url
      const command = new GetObjectCommand(params);
      const seconds = 60;
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: seconds,
      });
      console.log(url);

      return url;
    } catch (e) {
      return null;
    }
  }
}
