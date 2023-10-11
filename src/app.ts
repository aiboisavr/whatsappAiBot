import {connectToDatabase} from './config/db'
import express from 'express'
import bodyParser from 'body-parser'
import whatsappHandler from './controllers/whatsappHandler';

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
  console.log(req.body.From);
  console.log(req.body.To)
  
  
  });
  


  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });