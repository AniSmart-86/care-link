import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const ProtectedRoutes = createRouteMatcher( [ 
  "/doctors(.*)",
  "/doctor(.*)",
  "/appointments(.*)",
  "/onboarding(.*)",
  "/admin(.*)",
  "/video-call(.*)",
]);




export default clerkMiddleware(async(auth,req)=>{
  const { userId } = await auth();
  if (!userId && req.nextUrl.pathname.startsWith("/api")) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!userId && ProtectedRoutes(req)) {
    const { redirectToSignIn } = await auth();

    return redirectToSignIn();
    
}
return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};