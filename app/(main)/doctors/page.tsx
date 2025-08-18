"use client"

import { getCurrentUser } from '@/actions/user';
import { Card, CardContent } from '@/components/ui/card';
import { SPECIALTIES } from '@/lib/specialties';
import Link from 'next/link';

// import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const SpecialtyPage = () => {

  
   const [user, setUser] = useState<Awaited<ReturnType<typeof getCurrentUser>> | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);


 
   
  return (
<>    
    <div className='flex flex-col items-center justify-center bg-gradient-to-r from-emerald-900/20 to-purple-500/30 text-center p-4 rounded-md'>
<h1 className="text-3xl md:text-4xl font-bold text-white gradient-title mb-2">
  Find Your Doctor</h1>
<p className='text-muted-foreground mb-4 text-lg'>
Browse through our list of verified doctors
 to find the 
right specialist for your needs.  
</p>
    </div>
<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
{SPECIALTIES.map((specialty) => (
<Link  key={specialty.name} 
  href={`/doctors/${specialty.name}`}
      onClick={(e) => {
        if (user && user.role !== "PATIENT") {
          e.preventDefault(); // Stop navigation
          toast.warning("Please complete onboarding to view doctors.");
        }
      }}>

 <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full duration-300">
    
<CardContent className='p-6 flex flex-col items-center justify-center text-center h-full'>
    <div className='w-12 h-12 flex items-center justify-center rounded-full bg-emerald-900/20'>
      <div>{specialty.icon}</div>
    </div>
    
<h3 className='font-medium text-white'>{specialty.name}</h3>
<p className='text-muted-foreground text-xs'>{specialty.description}</p>    
  </CardContent>
  </Card>
  </Link>    

))}  
  </div>    
</>    
  )
}

export default SpecialtyPage