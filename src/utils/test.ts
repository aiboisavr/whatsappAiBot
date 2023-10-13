import axios from 'axios';

async function test()
{
    const finalImage= await axios.get('https://api.twilio.com/2010-04-01/Accounts/ACab7636e7880e087b64e638a9e09e0e4d/Messages/MM577c37203444ba33cfae5118b4afab75/Media/MEeac10941095321bf44b20fd5a0db9877')
    console.log(finalImage.request.socket._httpMessage.res.responseUrl)
}


test();