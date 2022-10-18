/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge'
};

const handler = (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name')?.slice(0, 16),
      image = searchParams.get('image'),
      theme = searchParams.has('theme') ? parseInt(searchParams.get('theme') as string) : null;
    if (!name || !image || theme === null || isNaN(theme) || theme > 6 || theme < 0)
      return new Response(null, { status: 400 });

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: ['#000000', '#000000', '#ffffff', '#ffffff', '#000000', '#000000'][theme],
            backgroundColor: ['#ffffff', '#ffffff', '#262626', '#000000', '#fee2e2', '#fef9c3'][
              theme
            ]
          }}>
          <img style={{ width: 300, height: 300, borderRadius: 150 }} src={image}></img>
          <div style={{ marginTop: 20, fontSize: 72, fontWeight: 600 }}>{name}</div>
          <div style={{ marginTop: 20, fontSize: 52, fontWeight: 600 }}>
            Frequently Asked Questions
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500
    });
  }
};

export default handler;
