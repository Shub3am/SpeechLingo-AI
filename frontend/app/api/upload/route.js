import {NextResponse, NextRequest} from "next/server"
import multer from "multer"

export async function POST(req,res) {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'public')
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
      }
  })
  let upload = multer({ storage: storage }).single('file')
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        return NextResponse.json(err)
    } else if (err) {
        return NextResponse.json(err)
    }
    console.log(req.file)
return NextResponse.send(req.file)

})

    //ffmpeg -y -i test.mp4 -vn -acodec copy output.aac 
}