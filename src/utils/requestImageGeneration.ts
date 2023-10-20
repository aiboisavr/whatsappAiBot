import axios from 'axios';
import  sharp  from 'sharp';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY
})

export default async function makeApiRequest(prompt:string,image:string,userId:string) {
  console.log(`${process.env.Base_URL}/api/image?userId=${userId}`)
  console.log(image)
  console.log(userId)
  const elaboratePrompt = await getElaboratePrompt(prompt)
  const apiUrl = process.env.API_URL as string;
  const apiKey = process.env.API_KEY as string;
  const dimensions = await getImageDimensions(image)
  const requestData = {
    prompt:`${elaboratePrompt?elaboratePrompt:prompt}`,
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

async function getElaboratePrompt(prompt:string){
  try{
    const elaboratePrompt = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
          {"role": "user", "content": `We are a prompt generation company aimed at creating elaborated prompts and background,We wil give the product and background in this format 'product, background '.You will have to return an eloborate prompt that will be compatible with stable diffusion image generation/inpainting when I provide the specified format.Do not add any details on the product rather focus on the background.Begin the sentence with respect to the product from the format given for example if it is chair,in a room begin it as Chair placed in a or Chair in a like that kind of usage.Give the prompt in a bit of concise manner but used nice common words.Be to the point separating the adjectives by comma rather than creating long sentence 
          Here Is the required combination
          ${prompt}`},
      ],
    });
    console.log(`elaborate prompt`)
    console.log(elaboratePrompt?.choices[0]?.message?.content)
    return elaboratePrompt?.choices[0]?.message?.content
  }catch(e){
    console.log(`Error while trying to elaborate given prompt: ${e}`)
  }
}


 //"https://ik.imagekit.io/lkrvcrvnx/img_OcMnKBpwU.png?updatedAt=1696658007323?tr=orig-true"//`${finalImage.request.socket._httpMessage.res.responseUrl}`,
 //'https://eol2i63njsm32p7.m.pipedream.net?userId=123',//

 //const finalImage= await axios.get(image)
//console.log(finalImage.request.socket._httpMessage.res.responseUrl)