import {connectToDatabase} from './config/db'
import express from 'express'
import bodyParser from 'body-parser'
import whatsappHandler from './controllers/whatsappHandler';
import session from 'express-session'
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

  console.log(req.body)
  whatsappHandler(req.body)
  
  });
  

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

