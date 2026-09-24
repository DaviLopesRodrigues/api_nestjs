import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';


export const getFileToBuffer = (fileName: string) => {
  const readStream = createReadStream(fileName);
  const chunks = [];

  return new Promise<{ buffer: Buffer; stream: ReadStream }>(
    (resolve, reject) => {
      readStream.on('data', (chunk) => chunks.push(chunk));

      readStream.on('error', (err) => reject(err));

      readStream.on('close', () => {
        resolve({
          buffer: Buffer.concat(chunks) as Buffer,
          stream: readStream,
        });
      });
    },
  );
};

export const getPhoto = async (): Promise<Express.Multer.File> => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, '..', 'testing', 'photo.png'),
  );

  const photo: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'photo.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1024 * 50,
    stream: stream,
    destination: '',
    filename: 'file-name',
    path: 'file-path',
    buffer: buffer,
  };

  return photo;
};

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  test('Validação de Definição - FileService', () => {
    expect(fileService).toBeDefined();
  });

  describe('Upload', () => {
    test('Method Upload File', async () => {
      const photo = await getPhoto();

      const result = await fileService.uploadAvatar(photo, 5);

      expect(result).toEqual({ success: true });
    });
  });
});
