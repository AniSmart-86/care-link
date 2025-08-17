import { getAvailableTimeSlots, getDoctorById } from '@/actions/appointments';
import { redirect } from 'next/navigation';
import React from 'react'
import DoctorsProfile from './_components/doctorsProfile';

const DoctorProfilepage = async({params}:{params:{id:string}}) => {
    const {id} = await params;

    try {
        const [doctorData, slotsData] = await Promise.all([

            getDoctorById(id),
            getAvailableTimeSlots(id)
        ]);

        return (
        <div>
<DoctorsProfile doctor={doctorData.doctor} 
                availableDays={slotsData.days || []}/>
        </div>
        )

    } catch (error) {
     console.error("Error loading doctor profile:",error);
     redirect("/doctors")   
    }

}

export default DoctorProfilepage