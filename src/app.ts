import {connectToDatabase} from './config/db'
import express from 'express'
import bodyParser from 'body-parser'
import whatsappHandler from './controllers/whatsappHandler';
import session from 'express-session'
import ImageHandler from './controllers/imageHandler';
import { handleOrderPaid,handlePaymentFailed } from './controllers/paymentHandler';
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

app.post('/api/image/',async function(req,res){
   
  const userId = String(req.query.userId); 
    ImageHandler(userId,req.body);

})

app.post('/orderPaid', async (req,res)=>{
  const orderPaidResponse = req.body.payload.order.entity;
  handleOrderPaid(orderPaidResponse)
  res.json({status:'ok'})
})

app.post('/paymentFailed', async (req,res)=>{
  const paymentFailedResponse = req.body;
  handlePaymentFailed(paymentFailedResponse)
  res.json({status:'ok'})
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

