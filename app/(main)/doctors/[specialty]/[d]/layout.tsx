import { getDoctorById } from '@/actions/appointments';
import PageHeader from '@/components/page.header';
import { redirect, useParams } from 'next/navigation';
import React, { ReactNode } from 'react'




export async function generateMetadata() {
  const params = useParams<{id:string}>();
    const {id} = await params;

    const { doctor } = await getDoctorById(id);

    return {
        title: `Dr. ${doctor.name} - DocLink`,
        description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} 
        specialist with ${doctor.experience} years of experience`,
    }
}



const DoctorProfilelayout = async({children}: {children: ReactNode}) => {
 const params = useParams<{id:string}>();

    const {id} = await params;

    const { doctor } = await getDoctorById(id);

    if(!doctor) redirect("/doctors");

    
  return (
    <div className="container mx-auto">
    <PageHeader
     title={"Dr. " + doctor.name}
     backLink={`/doctors/${doctor.specialty}`}
     backLabel={`Back to ${doctor.specialty}`}
     />
     {children}
    </div>
  )
}

export default DoctorProfilelayout