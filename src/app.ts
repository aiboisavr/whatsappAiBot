import {connectToDatabase} from './config/db'
import express from 'express'
import bodyParser from 'body-parser'
import whatsappHandler from './controllers/whatsappHandler';
import session from 'express-session'
import ImageHandler from './controllers/imageHandler';
connectToDatabase();


const app=express();
const port = process.env.PORT||3000;


app.use(bodyParser.json());
app.use(
    express.urlencoded({
      extended: true,
    })
  );


app.post('/api/bot', async function (req, res) {

  whatsappHandler(req.body)
  
  });

app.post('/api/image',async function(req,res){

    ImageHandler(req.query.userId,req.body);
})

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

