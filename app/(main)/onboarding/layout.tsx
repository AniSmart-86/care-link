import React, { ReactNode } from 'react'

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/user';


export const metadata = {
    title: 'Onboarding - DocLink',
    description: 'Complete your onboarding process to access all features of DocLink',
    };



const OnboardingLayout = async({children}:{children: ReactNode}) => {
  const user = await getCurrentUser();

  if(user){
    // Redirect if user is already onboarded
    if(user.role === "PATIENT"){
        redirect("/doctors");
     
    } else if(user.role === "DOCTOR"){
        if(user.verificationStatus === "VERIFIED"){
            redirect("/doctor");
        }else{
            redirect("/doctor/verification");
        }
    }else if(user.role === "ADMIN"){
        redirect("/admin");

  }
    return (
        <div className='container mx-auto px-4 py-32'>
            
            {children}
        </div>
  )


}
}
export default OnboardingLayout