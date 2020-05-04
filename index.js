const Fs = require('fs')
const Path = require('path')
const Axios = require('axios')

const images = require('./images');

async function downloadImage(url, name) {
    const path = Path.resolve(__dirname, 'images', name)
    const writer = Fs.createWriteStream(path)

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream',
        //Photobucket adds a watermark if a bot tries to download the image, so... :)
        // FOUND IN https://github.com/axios/axios/issues/2560
        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36' }
    });



    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

for (let image of images) {
    downloadImage(image, image.split('/').pop())
}