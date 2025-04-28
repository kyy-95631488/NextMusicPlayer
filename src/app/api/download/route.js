import { NextResponse } from 'next/server'
import ytdl from '@distube/ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import { PassThrough } from 'stream'

const ffmpegPath = require('ffmpeg-static')
ffmpeg.setFfmpegPath(ffmpegPath)
console.log('Using ffmpeg.exe at:', ffmpegPath)

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('id');
  const quality = searchParams.get('quality') || 128;

  if (!videoId) {
    return NextResponse.json({ error: 'No video ID provided' }, { status: 400 });
  }

  try {
    const videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
    const videoTitle = videoInfo.videoDetails.title;

    const audioStream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
      filter: 'audioonly',
      quality: 'highestaudio',
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      },
    });

    const stream = new PassThrough();

    ffmpeg(audioStream)
      .setFfmpegPath(ffmpegPath)
      .audioBitrate(quality)
      .format('mp3')
      .on('error', (err) => {
        console.error('FFMPEG Error:', err);
        stream.end();
      })
      .on('end', () => {
        console.log('FFMPEG Conversion Finished');
      })
      .pipe(stream);

    return new Response(stream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(videoTitle)}.mp3"`,
      },
    });
  } catch (error) {
    console.error('Error in processing the video:', error);
    return NextResponse.json({ error: 'Error processing the video' }, { status: 500 });
  }
}
