"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { updateDoctorsStatus } from '@/actions/admin';
import useFetch from '@/hooks/useFetch';
import { Ban, Loader2, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface  Doctor {
    id: string;
    name: string | null;
    email: string | null;
    specialty: string | null;
    experience: number | null;
    credentialUrl: string | null;
    description:string | null;
    createdAt: Date;
    verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | null;
}


const VerifiedDoctors = ({doctors}: {doctors: Doctor[]}) => {

    const [searchTerm,  setSearchTerm] = useState("");
    const [targetDoctor, setTargetDoctor] = useState<Doctor | null>(null);

    const filteredDoctors = doctors.filter((doctor) => {
    const query = searchTerm.toLowerCase();
    return (
        (doctor.name?.toLowerCase().includes(query) ?? false) ||
        (doctor.specialty?.toLowerCase().includes(query) ?? false) ||
        (doctor.email?.toLowerCase().includes(query) ?? false)
    );
});
    const {
            loading,
            data,
            fn:submitStatusUpdate
        } = useFetch(updateDoctorsStatus);

const handleStatusChange = async (doctor: Doctor) => {
const confirmed = window.confirm(`Are you sure you want to suspend ${doctor.name}?`);
    if (!confirmed || loading) return;

const formData = new FormData();
formData.append("doctorId", doctor.id);
formData.append("suspend", "true");

setTargetDoctor(doctor);
await submitStatusUpdate(formData);
};

useEffect(() => {
if( data?.success && targetDoctor) {

    toast.success(`Suspended ${targetDoctor.name} successfully!`);
    setTargetDoctor(null);
}    
    },[]);       

  return (
    <div>
        <Card className="bg-muted/20 dark:bg-muted/80 border-emerald-900/20">
            <CardHeader>
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>

                <CardTitle className="text-2xl font-semibold mb-2 text-white">
                    Manage Doctors
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-4">
                    View and manage the list of verified doctors.
                </CardDescription>
    </div>
<div className='relative w-full md:w-64'>
<Search className='absolute top-1/2 left-2 transform -translate-y-1/2 text-muted-foreground' />
<Input placeholder='Search doctors...' 
className='pl-8 bg-background border border-emerald-900/20'
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
/>
</div>
</div>
            </CardHeader>
            <CardContent>
                {/* Content for verified doctors will go here */}
{filteredDoctors.length === 0 ? (
<div className='text-center py-8 text-muted-foreground'>
{searchTerm ? 
<p className="text-muted-foreground">
No results found for "<strong>{searchTerm}</strong>". Please try a different search term.
</p> :
<p className="text-muted-foreground">
No verified doctors available at the moment.
</p>
}
</div>
):(
<div className='space-y-4'>
                {doctors.map((doctor:any)=>(
                    <Card key={doctor.id} className="bg-muted/30 border-emerald-900/20 hover:bg-muted/40 transition-colors">
                        <CardContent className='p-4'>
                        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-muted/20 rounded-full p-2'>
                                    <User className='h-6 w-6 text-emerald-400' />
                                </div>
                                <div>
                                    <h3 className='text-lg font-semibold text-white'>{doctor.name}</h3>
                                    <p className='text-sm text-muted-foreground'>{doctor.specialty} - {doctor.experience} years experience.</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2 self-end md:self-auto'>
                                <Badge variant={"outline"} className='bg-emerald-900/20 border-emerald-900/30 text-emerald-400'>Active</Badge>
                            <Button onClick={()=>handleStatusChange(doctor)} variant={"outline"} size="sm" className='bg-emerald-900/30 hover:bg-muted/80'>
                            {loading && targetDoctor === doctor.id ? <Loader2 className='h-4 w-4 animate-spin' /> : <Ban className='h-4 w-4' />}
                                Suspend                             
                            </Button>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                ))}

            </div>

                

       )}            
            </CardContent>
</Card>            
    </div>
  )
}

export default VerifiedDoctors