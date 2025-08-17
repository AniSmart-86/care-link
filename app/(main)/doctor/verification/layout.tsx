import PageHeader from '@/components/page.header'
import { Stethoscope } from 'lucide-react';
import React, { ReactNode } from 'react'

export const metadata = {
  title: 'Doctor Dashboard',
    description: 'Doctor Dashboard for managing appointments and patient records',
};

const DoctorDashboardLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='container mx-auto px-4 py-8 mt-24'>
        <PageHeader icon={<Stethoscope/>} title='DOCTOR DASHBOARD'/>
        {children}
        </div>
  )
}

export default DoctorDashboardLayout