import axios from 'axios';

export default async function makeApiRequest(prompt:string,image:string,userId:string) {
console.log(`${process.env.Base_URL}/api/image?userId=${userId}`)
console.log(image)
const finalImage= await axios.get(image)
console.log(finalImage.request.socket._httpMessage.res.responseUrl)
  const apiUrl = process.env.API_URL as string;
  const apiKey = process.env.API_KEY as string;
  const requestData = {
    prompt:`${prompt}`,
    webhook_url:  'https://eol2i63njsm32p7.m.pipedream.net',                  // `${process.env.Base_URL}/api/image?userId=${userId}`,
    image: `${finalImage.request.socket._httpMessage.res.responseUrl}`,
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


