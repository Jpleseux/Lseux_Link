import { UploadImageStorageInterface } from "@modules/profile/core/storage.interface";

export class StorageUploadMemory implements UploadImageStorageInterface {
  async delete(file: string): Promise<void> {}
  async get(fileKey: string): Promise<string> {
    return "";
  }
  async save(file: Express.Multer.File): Promise<string> {
    return "";
  }
}
