"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z  from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Stethoscope, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SPECIALTIES } from '@/lib/specialties';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { setUserRole } from '@/actions/user';


const doctorFormSchema = z.object({
    specialty: z.string().min(1, "Specialty is required"),
    experience: z.number().min(2, "Experience must be least 2 years"),
    credentialUrl: z.string().url("Invalid URL").min(1, "Credential URL is required"),
    description: z.string().max(1000, "Description cannot exceed 100 characters").optional(),
});

const Onboardingpage = () => {

 
    const [step, setStep] = useState("choose-role");
    const {data, fn:submitUserRole, loading}= useFetch(setUserRole)
    const router = useRouter();
    const [doctorFormData, setDoctorFormData] = useState({
        specialty: "",
        experience: 2,
        credentialUrl: "",
        description: ""
    });
    const {register,
         handleSubmit, 
         formState:{errors},
         setValue,
         watch
            }= useForm({
        resolver: zodResolver(doctorFormSchema),
        defaultValues: doctorFormData,
    });

    const specialtyValue = watch("specialty");

    const handlePatientSubmit=async()=>{
        if(loading) return;
   
        const formData = new FormData();
        formData.append("role", "PATIENT");
         await submitUserRole(formData);
    
    }

    useEffect(() => {
        if (data && data?.success) {
            toast.success("Role updated successfully");
                router.push(data.redirect);
            }
        },[data]);

        const doctorSubmit = async(data:any)=>{
                // const data = watch();
             if(loading) return;
                        const formData = new FormData();
                        formData.append("role", "DOCTOR");
                        formData.append("specialty", data.specialty);
                        formData.append("experience", data.experience.toString());
                        formData.append("credentialUrl", data.credentialUrl);
                        formData.append("description", data.description || "");
                        
                        await submitUserRole(formData);

                        setDoctorFormData({
                            specialty: "",
                            experience: 2,
                            credentialUrl: "",
                            description: ""
                        })

        }

       


    if(step === "choose-role") {
  return (
<>
<div className='max-w-3xl mx-auto'>
        
                <div className='text-center mb-8'>
                <h1 className='text-2xl md:text-4xl gradient-title my-4'>
                    Welcome to DocLink Onboarding
                </h1>
                <p className='text-md text-muted-foreground'>
                    Tell us how you want to use DocLink,
                    this will help us tailor your experience. 
                </p>
                </div>
                <div className='bg-muted/50 dark:bg-muted/80 p-6 rounded-lg shadow-md m-4'>
                    <p className='text-muted-foreground text-sm mb-4 text-center'>
                        Please select your role to proceed with the onboarding process.
                    </p>
                
                    </div>
                
            
            </div>

    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-4 mt-6">

    <Card onClick={()=>!loading && handlePatientSubmit()}
     className="max-w-lg bg-muted/50 dark:bg-muted/80 p-8 cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="mb-4 bg-emerald-900/20 p-4 rounded-full">
                <UserPlus className="h-12 w-12 text-emerald-400 mb-4" />
            </div>
            <CardTitle className="text-2xl font-semibold mb-2 text-white">
           Join as a Patient
            </CardTitle>
            <CardDescription className="text-muted-foreground mb-4">
                Book appointments with doctors, manage your health records, and get personalized care.
            </CardDescription>

            <Button 
                className=" bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-10 rounded"
                onClick={() => setStep("patient-form")}
            disabled={loading}>
                   {loading? (
                <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Processing...
              </>
              ): (" Get started")}
            </Button>

        </CardContent>
    </Card>

{/* doctor */}
    <Card onClick={()=>!loading && setStep("doctor-form")}
      className="max-w-xl bg-muted/50 dark:bg-muted/80 p-8 cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="mb-4 bg-emerald-900/20 p-4 rounded-full">
                <Stethoscope className="h-12 w-12 text-emerald-400 mb-4" />
            </div>
            <CardTitle className="text-2xl font-semibold mb-2 text-white">
                Join as a Doctor
            </CardTitle>
            <CardDescription className="text-muted-foreground mb-4">
                Manage your appointments, connect with patients, and grow your practice.
            </CardDescription>

            <Button 
                className=" bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-10 rounded"
                onClick={() => setStep("patient-form")}
            >
                Get Started
            </Button>

        </CardContent>
    </Card>
    </div>
    </>
  )
}

    if(step === "doctor-form") {

       
        return (
            <Card className="border border-emerald-900 max-w-3xl mx-auto">
                <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                    <div className="mb-4 ">

                    <CardTitle className="text-xl md:text-2xl font-semibold mb-2 gradient-title">
                        Complete your doctor profile
                        </CardTitle>
                    <CardDescription className='mb-4'>
                        Please fill out the form below to complete your onboarding as a doctor.
                        </CardDescription>
                    </div>

                    <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit(doctorSubmit)}>

                    <div className='space-y-2'>
                        <Label htmlFor='specialty' className='text-purple-600/80 font-bold text-xs'>Medical Speciality</Label>
                        <Select onValueChange={(value) => setValue("specialty", value)}
                        value={specialtyValue}>
                            <SelectTrigger id='specialty' className='w-full'>
                                <SelectValue placeholder="Select your specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                {SPECIALTIES.map((specialty) => (
                                    <SelectItem key={specialty.name}
                                     value={specialty.name} className='capitalize'>
                                        <div className='flex items-center gap-2'>
                                        <span className=''>{specialty.icon}</span>
                                        {specialty.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            
                                <SelectItem value="Surgery">Surgery</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.specialty && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.specialty.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='experience' className='text-purple-600/80 font-bold text-xs'>Years Of Experience</Label>
                       <Input id="experience"
                                type='number'
                                placeholder='EX: 5'
                                {...register("experience", {valueAsNumber:true})}/>
                       
                        {errors.experience && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.experience.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='credentialUrl' className='text-purple-600/80 font-bold text-xs'>Link to Credential Document</Label>
                       <Input id="credentialUrl"
                                type='url'
                                placeholder='ex: https://example.com/credential.pdf'
                                {...register("credentialUrl")}/>
                       
                        {errors.credentialUrl && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.credentialUrl.message}
                            </p>
                        )}
                        <p className='text-muted-foreground text-xs mt-1'>
                            Please provide a link to your credential document (e.g., medical license, board certification). 
                        </p>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description' className='text-purple-600/80 font-bold text-xs'>Description Of Your Services</Label>
                       <Textarea id="description"
                                placeholder='Describe your services and expertise'
                                rows={4}
                                {...register("description")}/>

                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                       
                    </div>
                    <div className='flex items-center justify-between mt-6'>
                        <Button
                        type='button'
                        variant="outline"
                        className="border-emerald-900/30 cursor-pointer"
                        onClick={() => setStep("choose-role")}
                        >Back</Button>
                        <Button 
                            className=" bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded cursor-pointer"
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Submitting...
                                </>
                            ) : (
                                "Submit for Review"
                            )}
                        </Button>
                    </div>
                    </form>
                </CardContent>
            </Card>
        )
    }

}

export default Onboardingpage