import {NextResponse, NextRequest} from "next/server"
const extractAudio = require('ffmpeg-extract-audio');

export async function GET() {
    //ffmpeg -y -i test.mp4 -vn -acodec copy output.aac 
    return NextResponse.json("Done")
}