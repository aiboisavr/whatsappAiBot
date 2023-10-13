import axios from 'axios';
// SDK initialization
import ImageKit from 'imagekit'

var imagekit = new ImageKit({
    publicKey : "public_rUJKKgMmEYw++LaDalw+lVFsNlg=",
    privateKey : "private_DKY8Rouje7gU5xvGTbXKYcasyVU=",
    urlEndpoint : "https://ik.imagekit.io/aibois"
});



async function test()
{
    const finalImage= await axios.get('https://api.twilio.com/2010-04-01/Accounts/ACab7636e7880e087b64e638a9e09e0e4d/Messages/MM577c37203444ba33cfae5118b4afab75/Media/MEeac10941095321bf44b20fd5a0db9877')
    console.log(finalImage.request.socket._httpMessage.res.responseUrl)
    imagekit.upload({file:'https://s3-external-1.amazonaws.com/media.twiliocdn.com/ACab7636e7880e087b64e638a9e09e0e4d/3fcd24357da892f4078cce801367fbc9',fileName:"cool"})
}


test();