import { NextResponse } from 'next/server'
import { PassThrough } from 'stream'
import { spawn } from 'child_process'

export const runtime = 'nodejs' // ensure this is set to run in Node.js environment

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const videoId = searchParams.get('id')
  const quality = searchParams.get('quality') || '128'

  if (!videoId) {
    return NextResponse.json({ error: 'Missing video id' }, { status: 400 })
  }

  // Set yt-dlp arguments for extracting the best audio format
  const ytdlpArgs = [
    '-f', 'bestaudio', // best audio format
    '-o', '-', // output to stdout (raw format)
    `https://www.youtube.com/watch?v=${videoId}` // video URL
  ]

  // Spawn yt-dlp process to download the audio
  const ytdlp = spawn('yt-dlp', ytdlpArgs, { stdio: ['ignore', 'pipe', 'pipe'] })

  // Log any errors from yt-dlp
  ytdlp.stderr.on('data', chunk => {
    console.error(`[yt-dlp] ${chunk.toString()}`)
  })

  // Set ffmpeg arguments for converting to MP3
  const ffmpegArgs = [
    '-i', 'pipe:0', // Input from stdin (yt-dlp output)
    '-vn', // No video
    '-ar', '44100', // Audio sample rate (optional)
    '-ac', '2', // Number of audio channels (optional)
    '-b:a', `${quality}k`, // Audio bitrate, uses the quality parameter
    '-f', 'mp3', // Force mp3 format
    'pipe:1' // Output to stdout (raw MP3)
  ]

  // Spawn ffmpeg process to convert the audio to MP3
  const ffmpeg = spawn('ffmpeg', ffmpegArgs, { stdio: ['pipe', 'pipe', 'pipe'] })

  // Pipe yt-dlp's stdout to ffmpeg's stdin
  ytdlp.stdout.pipe(ffmpeg.stdin)

  // Create a PassThrough stream to pipe the converted audio to the client
  const passThrough = new PassThrough()
  ffmpeg.stdout.pipe(passThrough)

  // Log any errors from ffmpeg
  ffmpeg.stderr.on('data', chunk => {
    console.error(`[ffmpeg] ${chunk.toString()}`)
  })

  // Set response headers for streaming the MP3 file
  const headers = {
    'Content-Type': 'audio/mpeg', // MIME type for MP3
    'Content-Disposition': `attachment; filename="${videoId}.mp3"`, // Suggested filename
  }

  // Return the MP3 audio stream to the client
  return new NextResponse(passThrough, {
    status: 200,
    headers,
  })
}
