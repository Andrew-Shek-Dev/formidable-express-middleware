import express,{Request,Response} from 'express';
import FormidableMiddleware,{IFormMiddleWareRequestTemplate} from '../lib/index';

const app = express();

interface FormData{
    content:string;
}
type FormMiddleWareRequest = IFormMiddleWareRequestTemplate<FormData>;

const uploadDir = 'uploads';
const formidableMiddleware = FormidableMiddleware({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 200 * 1024 ** 2,
      filter: (part) => part.mimetype?.startsWith('image/') || false,
})

app.post("/test",formidableMiddleware<FormData>("image",["content"]),(req:Request,res:Response)=>{
    const newReq = req as FormMiddleWareRequest;
    res.json({
        fields:newReq.fields,
        file:newReq.file
    });
});

app.listen(8080,()=>{
    console.log("The test server is started.")
});