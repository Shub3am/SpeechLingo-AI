const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
require('dotenv').config()
const {exec} = require("child_process");
const fs = require('fs');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const cloudinary = require("cloudinary")
const { Deepgram } = require("@deepgram/sdk");
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const deepgram = new Deepgram(process.env.deepgram_api);
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret,
  });

  const SERVER_URL = `${process.env.SERVER_URL}:${process.env.PORT}`
app.use(cors())
app.use(express.static('./public'))
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')

app.post('/upload', function(req, res) {
     let file = null;
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
           const filer = req.file
        const detach = exec(`ffmpeg -y -i ./${filer.path} -ss 00:00:00 -t 00:00:30.0 -vn -acodec pcm_s16le -ar 44100 -ac 2 ${filer.path}.wav`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            // console.log(`stderr: ${stderr}`);
            console.log("Transformed to /public/output.mp4")
            file = filer
            return;
        }
        console.log(`stdout: ${stdout}`);
      })
    })
    setTimeout(()=> {

      console.log(`http://${SERVER_URL}/${file.path}.wav`)
      const params = {
        // From file
        audio: fs.createReadStream(`${file.path}.wav`),
        contentType: 'audio/l16; rate=44100'
      };
      cloudinary.v2.uploader.upload(`./${file.path}.wav`,

  { public_id: file.filename, resource_type: "auto" },
  function(error, result) {

    deepgram.transcription
	.preRecorded({url: result.url}, {
		smart_format: true,
		model: "nova",
	})
	.then((response) => {

		// console.log(response, { depth: null });
        let x = response.results.channels[0].alternatives[0].transcript;
        const languageTranslator = new LanguageTranslatorV3({
          version: '2018-05-01',
          authenticator: new IamAuthenticator({
            apikey: process.env.IBM_watson_language_translator_api,
          }),
          serviceUrl: process.env.IBM_watson_language_translator_service_url,
        });
        const translateParams = {
          text: x,
          modelId: 'en-es',
        };
        languageTranslator.translate(translateParams)
  .then(translationResult => {
    const translated = translationResult.result.translations[0].translation
    const textToSpeech = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: process.env.IBM_watson_text_to_speech_api,
      }),
      serviceUrl: process.env.IBM_watson_text_to_speech_service_url,
    });
    console.log(translated)
    const synthesizeParams = {
      text: String(translated),
      accept: 'audio/wav',
      voice: 'en-US_AllisonV3Voice',
    };
    textToSpeech.synthesize(synthesizeParams)
  .then(response => {
    // The following line is necessary only for
    // wav formats; otherwise, `response.result`
    // can be directly piped to a file.
    return textToSpeech.repairWavHeaderStream(response.result);
  })
  .then(buffer => {
    fs.writeFileSync('translated.wav', buffer);
    try {fs.unlinkSync("./public/output.mp4")} catch(e) {null}
    
  }).then(x=> {
    console.log(file)
    const attach = exec(`ffmpeg -i ${file.path} -i translated.wav -map 0:v -map 1:a -c:v copy -shortest ./public/output.mp4`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log("Transformed")
          res.send(`http://${SERVER_URL}/output.mp4`)
          return;
      }
      console.log(`stdout: ${stdout}`);
    })
  })
  .catch(err => {
    console.log('error:', err);
  })
    // let x = JSON.stringify(translationResult, null, 2)


  })
  .catch(err => {
    console.log('error:', err);
  });

	})
	.catch((err) => {
		console.log(err);
	});

   });

    }, 1000)


});

app.listen(8000, function() {

    console.log('App running on port 8000');

});



