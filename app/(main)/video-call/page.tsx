import React from 'react'
import VideoCall from './_component/videoCall';

const VideoCallpage = async({searchParams}: {searchParams: URLSearchParams}) => {
    const { sessionId, token} = Object.fromEntries(searchParams);
  return (
    <div>
      <VideoCall sessionId={sessionId} token={token}/>
    </div>
  )
}

export default VideoCallpage