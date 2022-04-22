import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
import { mkdirSync } from 'fs';

export interface IFormMiddleWareFile {
  filepath: string;
  newFilename: string;
  originalFilename: string | null;
  mimetype: string | null;
}

export interface IFormMiddleWareRequestTemplate<T> extends Request {
  fields: T;
  file: IFormMiddleWareFile;
}

const FormidableMiddleware = (options:formidable.Options)=>{
  if (options.uploadDir){
    mkdirSync(options.uploadDir,{ recursive: true });
  }else{
    throw Error("uploadDir field must be provided!");
  }
  return <T>(_fieldName: string, targetFields: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    let body: T;
    let file: IFormMiddleWareFile;
    const form = formidable({
      ...options,
      filename: (orgFileName, orgExtName, part, _) => {
        const timestamp = Date.now();
        const ext = part.mimetype?.split('/').pop();
        const keys = Object.keys(body);
        const values = Object.values(body);
        const naming = keys.reduce(
          (acc, key, idx) => (targetFields.includes(keys[idx]) ? `${values[idx]}-` + acc : acc),
          '',
        );
        return `${naming}${timestamp}.${ext}`;
      },
    });

    form
      .on('field', (name, value) => {
        body = {
          ...body,
          [name]: value,
        };
      })
      .on('file', (fieldName, _file) => {
        if (fieldName === _fieldName) {
          file = {
            filepath: _file.filepath,
            newFilename: _file.newFilename,
            originalFilename: _file.originalFilename,
            mimetype: _file.mimetype,
          };
        }
      });

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      req.body = {
        fields:body,
        file:file
      }
      next();
    });
  };
};
export default FormidableMiddleware;
