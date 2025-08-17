import { Loader2 } from 'lucide-react'


function Loading () {
  return (
    <div className='flex items-center justify-center mx-auto h-screen z-50'>
        
    <div className='flex flex-col items-center justify-cener'>
        <Loader2 className='h-16 w-16 text-emerald-400 animate-spin'/>
        <p className='text-2xl text-white'>Loading...</p>

        <div className='mt-4 text-muted-foreground'>
          Please wait.
          </div>
    </div>
    </div>

  )
}

export default Loading