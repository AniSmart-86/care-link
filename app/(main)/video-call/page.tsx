"use client";

import { useSearchParams } from "next/navigation";
import VideoCall from "./_component/videoCall";

export default function VideoCallPage() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("sessionId") ?? "";
  const token = searchParams.get("token") ?? "";

  return (
    <div>
      <VideoCall sessionId={sessionId} token={token} />
    </div>
  );
}
