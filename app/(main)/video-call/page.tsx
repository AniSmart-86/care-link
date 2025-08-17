import React from 'react'
import VideoCall from './_component/videoCall';
import { useSearchParams } from 'next/navigation';

const VideoCallpage = async() => {
  const searchParams = useSearchParams();
    const { sessionId, token} = Object.fromEntries(searchParams);
  return (
    <div>
      <VideoCall sessionId={sessionId} token={token}/>
    </div>
  )
}

export default VideoCallpage