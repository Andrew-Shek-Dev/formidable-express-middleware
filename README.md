# formidable-express-middleware

## Background
Let [formidable](https://github.com/node-formidable/formidable) has ability of insert HTML Form Data such as user_id, user_name in the customized filename.

## How to use?
import the library
```typescript
import FormidableMiddleware,{IFormMiddleWareRequestTemplate} from 'formidable-express-middleware';
```

Create the HTML Form Data Data Type:
```typescript
interface IFormMiddleWareFields{
    content:string
}
```

Create the Middleware Instance
```typescript
const uploadDir = 'uploads';
const formidableMiddleware = FormidableMiddleware({
      /*formidable options*/
      uploadDir,
      keepExtensions: true,
      maxFileSize: 200 * 1024 ** 2,
      filter: (part) => part.mimetype?.startsWith('image/') || false,
})
```

Create a Express.js Web Service which use formidable, and insert the middleware in the function.
```typescript
app.post("/memo", 
formidableMiddleware<IFormMiddleWareFields>(
    "image" /*file upload HTML element name*/, 
    ["content"] /*Form Data Names which are added in filename*/),

    async (req: Request, res: Response) => {
        const memos = [];
        memos.push({
            content: req.fields.content,
            image: req.file.newFilename
        });
        res.json(memos);
    }
});
```

## How to test?
Please run following command under terminal under "test" folder
```
npx ts-node server.ts
```

Please run Insomnia/Postman testing following service:
```
http://localhost:8080/test

Method: POST
Required Fields:
content (plain text)
image (image file)
```