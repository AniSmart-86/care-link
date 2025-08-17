import React, { ReactNode } from 'react'

const Doctorslayout = ({ children }: { children: ReactNode }) => {
  return (    
    <div className='container mx-auto px-4 py-12 mt-10'>
<div className="max-w-6xl mx-auto">
      {children}
  </div>     
      </div>
  )
}

export default Doctorslayout