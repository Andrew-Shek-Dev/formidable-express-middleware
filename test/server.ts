import express,{Request,Response} from 'express';
import FormidableMiddleware,{IFormMiddleWareRequestTemplate} from '../lib/index';

const app = express();

interface FormData{
    content:string;
}

const uploadDir = 'uploads';
const formidableMiddleware = FormidableMiddleware({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 200 * 1024 ** 2,
      filter: (part) => part.mimetype?.startsWith('image/') || false,
})

app.post("/test",formidableMiddleware<FormData>("image",["content"]),(req:Request,res:Response)=>{
    res.json({
        fields:req.body.fields,
        file:req.body.file
    });
});

app.listen(8080,()=>{
    console.log("The test server is started.")
});