import axios from 'axios';

export default async function makeApiRequest(prompt:string,image:string,userId:string) {
console.log(`${process.env.Base_URL}/api/image?userId=`+encodeURIComponent(userId))
console.log(image)
console.log(userId)
  const apiUrl = process.env.API_URL as string;
  const apiKey = process.env.API_KEY as string;
  const requestData = {
    prompt:`${prompt}`,
    webhook_url:`${process.env.Base_URL}/api/image/?userId=${userId}`,
    image:`https://res.cloudinary.com/dmkarf8ed/image/fetch/w_496,h_496/f_png/${image}`
   
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    console.log('Request successful:', response.data);
  } catch (error) {
    console.error('Request failed:', error);
  }
}


 //"https://ik.imagekit.io/lkrvcrvnx/img_OcMnKBpwU.png?updatedAt=1696658007323?tr=orig-true"//`${finalImage.request.socket._httpMessage.res.responseUrl}`,
 //'https://eol2i63njsm32p7.m.pipedream.net?userId=123',//

 //const finalImage= await axios.get(image)
//console.log(finalImage.request.socket._httpMessage.res.responseUrl)