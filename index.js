const axios = require('axios');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(function(req, res, next) {
  const origin = req.headers.origin;
  if(origin){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', async function(request, response) {
  try {
    const result = printRandomImage();
    response.json(result);
  }
  catch(e) {
    response.status(500) 
  }
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const regex = /\["(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)"/g // the only difference is the [ at the beginning

let PHOTO_LINKS = [];

function extractPhotos(content) {
    const links = new Set();
    let match;

    while (match = regex.exec(content)) {
        links.add(match[1]);
    }
 
    return Array.from(links);
}

async function getAlbum(id) {
    console.log('Updating photos...');
    const response = await axios.get(`https://photos.app.goo.gl/${id}`)
    console.log('UPDATE COMPLETED!');
    return response.data 
}

function printRandomImage() {
    const randomImageUrl = PHOTO_LINKS[Math.floor(Math.random() * PHOTO_LINKS.length)]
    return randomImageUrl;
}

(async () => {
    const albumHtmlContent = await getAlbum(process.env.PHOTO_ALBUM_ID);
    PHOTO_LINKS = extractPhotos(albumHtmlContent);
})();
