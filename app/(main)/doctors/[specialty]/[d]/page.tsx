import { getAvailableTimeSlots, getDoctorById } from '@/actions/appointments';
import { redirect, useParams } from 'next/navigation';
import React from 'react'
import DoctorsProfile from './_components/doctorsProfile';



type Doctor={
    id: string;
}
const DoctorProfilepage = async() => {
    const {id} = useParams();
    

    try {
        const [doctorData, slotsData] = await Promise.all([

            getDoctorById(id as string),
            getAvailableTimeSlots(id as string)
        ]);

        return (
        <div>
<DoctorsProfile doctor={doctorData.doctor as Doctor} 
                availableDays={slotsData.days || []}/>
        </div>
        )

    } catch (error) {
     console.error("Error loading doctor profile:",error);
     redirect("/doctors")   
    }

}

export default DoctorProfilepage