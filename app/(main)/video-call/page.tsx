import React from 'react'
import VideoCall from './_component/videoCall';
import { useSearchParams } from 'next/navigation';

const VideoCallPage = () => {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get('sessionId') ?? "";
  const token = searchParams.get('token') ?? "";

  return (
    <div>
      <VideoCall sessionId={sessionId} token={token} />
    </div>
  )
}

export default VideoCallPage;