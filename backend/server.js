const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
const {exec} = require("child_process");
const fs = require('fs');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const { stdout, stderr } = require('process');
const cloudinary = require("cloudinary")
const { Deepgram } = require("@deepgram/sdk");
const deepgram = new Deepgram("ad55fc041228016f83fcdd26a45aaaab226bf83c");
cloudinary.config({
    cloud_name: 'daglt9noz',
    api_key: '438713331415379',
    api_secret: 'na3POCIYnTz9_lONHMr3WP8wklo'
  });
app.use(cors())
app.use(express.static('public'))
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
    console.log("this got called")
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
            console.log("Transformed")
            file = filer
            return;
        }
        console.log(`stdout: ${stdout}`);
      })
    })
    setTimeout(()=> {
        const speechToText = new SpeechToTextV1({
        authenticator: new IamAuthenticator({ apikey: '6n9MEXnwouxwdEqIj6M5Z7-LGl-26ZstewAcJolGMsP_' }),
        serviceUrl: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/6e46f3f2-6692-455e-a883-050814e39cbc'
      });
      console.log(`http://localhost:8000/${file.path}.wav`)
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

		console.log(response, { depth: null });
        let x = response.results.channels[0].alternatives[0].transcript;

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







// let data;
//       const detach = exec(`ffmpeg -y -i ./${filer.path} -vn -acodec pcm_s16le -ar 44100 -ac 2 ${filer.path}.wav`, (error, stdout, stderr) => {
//         if (error) {
//             console.log(`error: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             // console.log(`stderr: ${stderr}`);
//             console.log("Transformed")
//             return;
//         }
//         console.log(`stdout: ${stdout}`);
//       })
//       const speechToText = new SpeechToTextV1({
//         authenticator: new IamAuthenticator({ apikey: '6n9MEXnwouxwdEqIj6M5Z7-LGl-26ZstewAcJolGMsP_' }),
//         serviceUrl: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/6e46f3f2-6692-455e-a883-050814e39cbc'
//       });

//       const params = {
//         // From file
//         audio: fs.createReadStream(`${filer.path}.wav`),
//         contentType: 'audio/l16; rate=44100'
//       };

//     //   speechToText.recognize(params)
//     //     .then(response => {
//     //       console.log(JSON.stringify(response.result, null, 2));
//     //       return res.json("Done AAA")
//     //     })
//     //     .catch(err => {
//     //       console.log(err);
//     //     });
//     fs.createReadStream(`./${filer.path}.wav`)
//   .pipe(speechToText.recognizeUsingWebSocket({ contentType: 'audio/l16; rate=44100' }))
//   .pipe(fs.createWriteStream('./transcription.txt'));
