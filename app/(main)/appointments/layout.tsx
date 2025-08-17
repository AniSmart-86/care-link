import React, { ReactNode } from 'react'

const Appointmentlayout = ({children}:{children: ReactNode}) => {
  return (
    <div className='container mx-auto mt-16'>

        {children}
    </div>
  )
}

export default Appointmentlayout