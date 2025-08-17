import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex flex-col items-center justify-cener h-screen inset-0 fixed z-50'>
        <Loader2 className='h-24 w-24 animate-spin'/>
        <p className='text-3xl text-muted-foreground'>Loading...</p>
    </div>
  )
}

export default Loading