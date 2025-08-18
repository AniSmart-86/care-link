"use client"

import { updateDoctorsStatus } from '@/actions/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import useFetch from '@/hooks/useFetch';
import { Check, ExternalLink, FileText, Medal, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { format } from 'util';
import BarLoader from 'react-spinners/BarLoader';





interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  credentialUrl: string;
  description: string;
  createdAt: Date;
}

interface Props {
  doctors: Doctor[];
}


const PendingDoctors = ({doctors}:Props) => {
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const {
        loading,
        data,
        fn:submitStatusUpdate
    } = useFetch(updateDoctorsStatus);

    const handleViewDetails = (doctors: Doctor)=>{
        setSelectedDoctor(doctors);
    }

    const handleCloseDialog=()=>{
        setSelectedDoctor(null);
    }

    const handleUpdateStatus = async (doctorId: string, status: "VERIFIED" | "REJECTED") => {
        if (loading) return;

       const formData = new FormData();
        formData.append("doctorId", doctorId);
        formData.append("status", status);

        await submitStatusUpdate(formData);

        useEffect(() => {
            if (data && data.success) {
              handleCloseDialog();
            }
        }, [data]);
    }
  return (
    <div>
<Card 
     className="bg-muted/20 dark:bg-muted/80 border-emerald-900/20">
            <CardHeader>

            <CardTitle className="text-2xl font-semibold mb-2 text-white">
           Pending Doctors Verifications
            </CardTitle>
            <CardDescription className="text-muted-foreground mb-4">
                Review and verify the pending doctor applications.
            </CardDescription>
            </CardHeader>

        <CardContent className="">
           {doctors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
                No pending doctors found.

            </div>
           ) : (
            <div className='space-y-4'>\
                {doctors.map((doctor)=>(
                    <Card key={doctor.id} className="bg-muted/30 border-emerald-900/20 hover:bg-muted/40 transition-colors">
                        <CardContent className='p-4'>
                        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                            <div>
                                <div className='bg-muted/20 rounded-full p-2'>
                                    <User className='h-6 w-6 text-emerald-400' />
                                </div>
                                <div>
                                    <h3 className='text-lg font-semibold text-white'>{doctor.name}</h3>
                                    <p className='text-sm text-muted-foreground'>{doctor.specialty} - {doctor.experience} years experience.</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2 self-end md:self-auto'>
                                <Badge variant={"outline"} className='bg-amber-900/20 border-amber-900/30 text-amber-400'>Pending</Badge>
                            <Button onClick={()=>handleViewDetails(doctor)} variant={"outline"} size="sm" className='bg-emerald-900/30 hover:bg-muted/80'>
                                View Details
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

{selectedDoctor && (
    <Dialog open={!!selectedDoctor} onOpenChange={handleCloseDialog}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className='max-w-3xl mx-auto bg-muted/30 border-emerald-900/20'>

        <DialogHeader>

        <DialogTitle className='text-xl font-bold text-white'>Doctor Verification Details</DialogTitle>
        <DialogDescription>
            Review the details of the selected doctor's and update their verification status.
        </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">

        <div className='flex flex-col md:flex-row gap-6 mb-4'>
            <div className='space-y-1 flex-1'>
                <h4 className='text-sm font-medium text-muted-foreground'>Full Name</h4>
                <p className='text-base font-medium text-white'>{selectedDoctor.name}</p>
            </div>
            <div className='space-y-1 flex-1'>
                <h4 className='text-sm font-medium text-muted-foreground'>Email</h4>
                <p className='text-base font-medium text-white'>{selectedDoctor.email}</p>
            </div>
            <div className='space-y-1 flex-1'>
                <h4 className='text-sm font-medium text-muted-foreground'>Application Date</h4>
                <p className='text-base font-medium text-white'>{format(new Date(selectedDoctor.createdAt), "PPP")}</p>
            </div>
        </div>

        <Separator className='bg-emerald-900/20'/>

        <div className='space-y-4'>

        <div className='flex items-center gap-2'>
            <Medal className='h-6 w-6 text-emerald-400 mb-2' />
            <h3 className='text-sm font-medium text-muted-foreground'>
                Professional Details
            </h3>
        </div>


        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6'>

        <div className='space-y-1'>
            <h4 className='text-sm font-medium text-muted-foreground'>Specialty</h4>
            <p className=' text-white'>{selectedDoctor.specialty}</p>
        </div>
        <div className='space-y-1'>
            <h4 className='text-sm font-medium text-muted-foreground'>Years of Experience</h4>
            <p className=' text-white'>{selectedDoctor.experience} years</p>
        </div>

        <div className='space-y-1 col-span-1'>
            <h4 className='text-sm font-medium text-muted-foreground'>Credential URL</h4>
            <div className='flex items-center'>

            <a href={selectedDoctor.credentialUrl ?? undefined} 
             target="_blank" rel="noopener noreferrer"
              className='text-blue-400 hover:underline flex items-center'>
                View Credentials
                <ExternalLink className='ml-1 h-4 w-4' />
            </a>
            </div>
        </div>
        </div>
        </div>
        <Separator className='bg-emerald-900/20'/>

        <div className='space-y-2'>
        <div className='flex items-center gap-2'>
            <FileText className='h-6 w-6 text-emerald-400 mb-2' />
            <h3 className='text-sm font-medium text-muted-foreground'>
                Service Description 
            </h3>
            </div>
            <p className='text-muted-foreground text-sm whitespace-pre-line'>
                {selectedDoctor.description || "No description provided."}
            </p>
            </div>
        </div>

        {loading && <BarLoader width={"100%"} color="#36d7b7"/>}

        <DialogFooter className="flex sm:justify-between">
            <Button variant={"destructive"}
            disabled={loading}
            className='bg-red-600 hover:bg-red-700'
            onClick={()=>handleUpdateStatus(selectedDoctor.id, "REJECTED")}>
                <X className='h-4 w-4 mr-2' />
                Reject
            </Button>
            <Button
            disabled={loading}
            className='bg-emerald-600 hover:bg-emerald-700'
            onClick={()=>handleUpdateStatus(selectedDoctor.id, "VERIFIED")}>
                <Check className='h-4 w-4 mr-2' />
                Approve
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
)}
    </div>
  )
}

export default PendingDoctors