
import { getPatientAppointments } from '@/actions/patient';
import { getCurrentUser } from '@/actions/user';
import AppointmentCard from '@/components/appointmentCard';
import PageHeader from '@/components/page.header';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const PatientAppointmentpage = async() => {

    const user = await getCurrentUser();

    if(!user || user.role !== "PATIENT"){
        redirect("/onboarding");
    }

    const {appointments, error} = await getPatientAppointments();
  return (
    <div className='container mx-auto px-4 py-8 mt-10'>
        <PageHeader
        icon={<Calendar/>}
        title='My Appointments'
        backLink='/doctors'
        backLabel='Find Doctors'
        />

            {error ? (
                <div className='text-center py-8'>
                    <p className='text-red-400'>Error: {error}</p>
                </div>
            ) : (appointments && appointments.length > 0 )? (
                <div className='space-y-4'>
                    {appointments?.map((appointment)=>(
                        <AppointmentCard
                        key={appointment.id}
                        appointment={{...appointment,
                            
                        }}
                        userRole={"PATIENT"}/>
                    ))}
                </div>
            ) :(
                <div className='text-center py-8'>
                    <Calendar className='h-12 w-12 mx-auto text-muted-foreground mb-3'/>
                <h3 className='text-xl font-medium text-white mb-2'>
                    No appointment scheduled
                </h3>
                <p className='text-muted-foreground'>
                    You don't have any appointments scheduled yet.
                     Browse our doctors and book your first consultation.
                </p>
                </div>
            )}
            
        </div>
  )
}

export default PatientAppointmentpage