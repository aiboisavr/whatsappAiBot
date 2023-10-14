import axios from 'axios';
import sharp from 'sharp';

async function getImageDimensions(mediaUrl: string) {
  try {
    // Download the image
    const response = await axios.get(mediaUrl, { responseType: 'arraybuffer' });

    if (response.config.url) {
      // Read the image dimensions using sharp
      let { width, height } = await sharp(response.data).metadata();
      if(width)
       width=(Math.floor(width/8))*8
      if(height)
        height=(Math.floor(height/8))*8
      // Delete the temporary file
     // await unlink(response.config.url);
      

      return { width, height };
    } else {
      console.error('URL is undefined. Cannot delete the temporary file.');
    }
  } catch (error) {
    console.error('Error fetching image or reading dimensions:', error);
    return null;
  }
}



export default async function makeApiRequest(prompt:string,image:string,userId:string) {
console.log(`${process.env.Base_URL}/api/image?userId=`+encodeURIComponent(userId))
console.log(image)
console.log(userId)
  const dimensions=await getImageDimensions(image);
  console.log(dimensions)
  const apiUrl = process.env.API_URL as string;
  const apiKey = process.env.API_KEY as string;
  const requestData = {
    prompt:`${prompt}`,
    webhook_url:`${process.env.Base_URL}/api/image/?userId=${userId}`,
    image:`https://res.cloudinary.com/dmkarf8ed/image/fetch/w_${dimensions?.width},h_${dimensions?.height}/f_png/${image}`
   
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