import * as AWS from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadImageStorageInterface } from "@modules/profile/core/storage.interface";
import { apiError } from "src/http/nestjs/helpers/api-Error.helper";
export class UploadImageStorageAws implements UploadImageStorageInterface {
  private s3ClientVar: any = null;

  constructor() {
    this.s3ClientVar = new AWS.S3({
      region: process.env.STORAGE_REGION,
      credentials: {
        accessKeyId: process.env.STORAGE_KEYID,
        secretAccessKey: process.env.STORAGE_ACCESSKEY,
      },
    });
  }

  async delete(file: string): Promise<void> {
    const deleteCommand = new AWS.DeleteObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: file,
    });
    const responseDelete = await this.s3ClientVar.send(deleteCommand);
    if (responseDelete.$metadata.httpStatusCode > 300) {
      throw new apiError("Erro ao excluir imagem antiga", 400, "NOT_DONE");
    }
  }
  async save(file: Express.Multer.File): Promise<string> {
    const fileRef = `profile/${file.filename}`;
    const command = new AWS.PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: fileRef,
      Body: createReadStream(file.path),
      ContentType: file.mimetype,
      ACL: "public-read",
    });
    const response = await this.s3ClientVar.send(command);
    if (response.$metadata.httpStatusCode > 300) {
      throw new apiError("Erro ao salvar imagem", 400, "NOT_FOUND");
    }
    return fileRef;
  }
  async get(fileKey: string): Promise<string> {
    const command = new AWS.PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: fileKey,
    });
    const url: string = await getSignedUrl(this.s3ClientVar, command);
    return url;
  }
}
