
import { getDoctorsBySpecialty } from '@/actions/doctorslisting';
import DoctorCard from '@/components/doctorCard';
import PageHeader from '@/components/page.header'
import { redirect, useParams} from 'next/navigation';
import React from 'react'


const SpecialtyPage = async () => {
  const params = useParams<{specialty:string}>();
const { specialty } = await params;

if(!specialty){
    redirect("/doctors");
}

const {doctors, error} = await getDoctorsBySpecialty(specialty);

if(error){
    console.error("Error fetching doctors:", error);
    }


  return (
    <div className='space-y-5'>
<PageHeader title={specialty.split("%20").join(" ")}
backLink='/doctors'
backLabel='All Specialists'/> 

{doctors && doctors.length > 0 ? (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
{doctors.map((doctor) => (
    <DoctorCard key={doctor.id} doctor={doctor} />
))}

    </div>
):(
    <div className="text-center py-12">
        <h3 className="text-xl font-medium text-white mb-2">No doctors found for this specialty.</h3>
        <p className='text-muted-foreground'>Please check back later or choose a different specialty.</p>
    </div>
)}
    </div>
  )
}

export default SpecialtyPage