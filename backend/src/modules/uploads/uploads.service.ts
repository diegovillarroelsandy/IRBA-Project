/// <reference types="multer" />
import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
// Importa el tipo directamente
@Injectable()
export class UploadsService {
  constructor(
    @Inject('CLOUDINARY')
    private cloudinary: typeof Cloudinary,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    const multerFile = file;

    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream({ folder: 'irba-products' }, (error, result) => {
          if (error) {
            return reject(new Error(error.message));
          }
          resolve(result);
        })
        .end(multerFile.buffer);
    });
  }
}
