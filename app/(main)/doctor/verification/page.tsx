
import { getCurrentUser } from '@/actions/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ClipboardCheck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const VerificationPage = async() => {

    const user = await getCurrentUser();

    // If doctor is verified, redirect to the dashboard page
    if (user && user.role === "DOCTOR" && user.verificationStatus === "VERIFIED") {
        redirect("/doctor");
    }

    const isRejected = user?.verificationStatus === "REJECTED";
  return (
    <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
            <Card className='border-emerald-900/20'>
                <CardHeader className='text-center'>
                    <div className={`mx-auto p-4 ${
                        isRejected ? "bg-red-900/20 text-red-500" : "bg-emerald-900/20 text-emerald-400"
                    } rounded-full mb-4 w-fit`}>

                        {/* <h2 className='text-2xl font-bold mb-4'>Doctor Verification</h2> */}
                        {isRejected ? (
                            <>
                            <XCircle className='h-8 w-8 text-red-400' />
                                                        </>
                        ) : (
                            <>
                            <ClipboardCheck className='h-8 w-8 text-emerald-400' />
                    
                            </>
                        )}
                    </div>
                    <CardTitle className='text-2xl font-semibold mb-2 text-white'>
                        {isRejected ? "Verification Rejected" : "Verification in Progress"}
                    </CardTitle>
                    <CardDescription className='text-muted-foreground text-sm'>
                        {isRejected ? (
                        "Your verification has been rejected. Please contact support for more details."
                        ) : (
                        "Thank you for submitting. We are reviewing your documents and will get back to you shortly."
                        )}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                        {isRejected ? (
                    <div className='bg-red-900/10 border border-red-900/20 rounded-lg p-4 mb-6 flex items-start'>
                        <AlertCircle className='h-5 w-5 inline-block mr-2 mt-1 flex-shrink-0' />
                            <div className='text-muted-foreground text-left'>
                                <p className='mb-2'>
                                    Our administrative team has reviewed your 
                                    verification documents and found it doesn&apos;t 
                                    meet our requirements. 
                                    Common reasons for rejection include:
                                    
                                </p>
                                <ul className='list-disc pl-5 space-y-1 mb-3'>
                                    <li>Incomplete or missing documents</li>
                                    <li>Documents not matching your profile information</li>
                                    <li>Documents not meeting our quality standards</li>
                                    <li>Issues with document authenticity</li>
                                     <li>Professional Experience requirements not met </li>

                                </ul>
                                {/* <p>You can update your profile and resubmit for review.</p> */}

                            </div>
                    </div>
                        ):(
                            <div className='bg-muted/30 border border-red-900/20 rounded-lg p-4 mb-6 flex items-start'>
                            <AlertCircle className='h-5 w-5 inline-block mr-2 mt-1 flex-shrink-0' />

                            <p>
                                Your profile is currently under review by our administrative team.
                                This process typically takes 1-2 working days.
                                You&apos;ll receive an email notification once your account is verified
                            </p>
                            </div>
                        )}
                        <p className='text-muted-foreground'>
                            {isRejected ? "You can update your profile and resubmit for verification"
                             : "While you wait, you can familiarize yourself with our platform or reach out to our support team for any questions."}
                        </p>

                        <div className="m-4">
                            <Button 
                            asChild
                            variant={"outline"}
                            className='border-emerald-900/30'>
                                <Link href={"/"}>
                                Return to Home
                                </Link>
                            </Button>
                        </div>
                
                </CardContent>
                    
            </Card>
        </div>
    </div>
  )
}

export default VerificationPage