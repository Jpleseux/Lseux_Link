export interface UploadImageStorageInterface {
  save(file: Express.Multer.File): Promise<string>;
  delete(file: string): Promise<void>;
  get(fileKey: string): Promise<string>;
}
