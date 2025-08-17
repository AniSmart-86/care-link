import { getcurrentUser } from '@/actions/onboarding'
import { redirect } from 'next/navigation';
import React from 'react'
import { getDoctorAppointment, getDoctorsAvailability } from '@/actions/doctor';
// import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { AlertCircle, Calendar, Clock, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvailabilitySetting from './_components/availabilitySetting';
import AppointmentList from './_components/appointmentList';

const DoctorDashboard = async() => {

    const user = await getcurrentUser();

    const [appointmentsData, availabilityData] = await Promise.all([
        getDoctorAppointment(),
        getDoctorsAvailability(),
    ]);

    if(user?.role !== "DOCTOR"){
        redirect("/onboarding");
    }

    // if(user?.verificationStatus !== "VERIFIED"){
    //     redirect("/doctor/verification");
    // }
  return (
    <Tabs defaultValue='appointments' 
     className='py-24 grid grid-cols-1 md:grid-cols-4 gap-6'>
        <TabsList className='md:col-span-1 bg-muted/30 border h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 
        md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0'>
            <TabsTrigger value={'appointments'} className='flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full'>
                <Calendar className='h-4 w-4 mr-2 hidden md:inline text-emerald-600'/>
                <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value={'availability'} className='flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full'>
                <Clock className='h-4 w-4 mr-2 hidden md:inline text-emerald-600'/>
                <span>Availability</span>
            </TabsTrigger>
        </TabsList>
    
            <div className="md:col-span-2">

            <TabsContent value='appointments' className='border-none p-0'>
                <AppointmentList appointments={appointmentsData.appointments || []}/>
            </TabsContent>

            <TabsContent value="availability" className="border-none p-0">
  <AvailabilitySetting
    slots={(availabilityData.slots || []).map(slot => ({
      ...slot,
      startTime:
        slot.startTime instanceof Date
          ? slot.startTime.toISOString()
          : String(slot.startTime),
      endTime:
        slot.endTime instanceof Date
          ? slot.endTime.toISOString()
          : String(slot.endTime),
    }))}
  />
</TabsContent>

            </div>
     </Tabs>
  )
}

export default DoctorDashboard