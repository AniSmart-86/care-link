
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import {  Calendar, CreditCard, ShieldCheck, Stethoscope, User } from 'lucide-react'
import { createUser } from '@/lib/createuser'
import { allocateCredits } from '@/actions/credits'
import { Badge } from './ui/badge'

const Header = async() => {
  const user = await createUser();
  if(user?.role === "PATIENT"){
    await allocateCredits({user:{...user, transactions: []}});
  }
 
  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b supports-[backdrop-filter]:bg-background/60 z-10">
 
        <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
            <Link href={"/"}>
            <Image 
            src="/doclink-img.png"
            alt="DocLink Logo"
            width={80}
            height={60}
            className={"h-10 object-cover"}

            />
            </Link>  

            <div className='flex items-center space-x-2'>
             

            <SignedIn>
            {user?.role === "ADMIN" &&(
              <Link href={"/admin"}>
                <Button className='hidden md:inline-flex items-center gap-2 cursor-pointer' variant="outline">
                  <ShieldCheck className='w-4 h-4' />
                  Admin Dashboard
                </Button>

                <Button className='md:hidden w-10 h-10 p-0 cursor-pointer' variant="ghost">
                  <ShieldCheck className='h-4 w-4'/>
                  {/* <UserButton /> */}
                </Button>
              </Link>
            )}
            {user?.role === "DOCTOR" &&(
              <Link href={"/doctor"}>
                <Button className='inline-flex items-center gap-2 cursor-pointer' variant="outline">
                  <Stethoscope className='w-4 h-4' />
                  Doctor Dashboard
                </Button>

                <Button className='md:hidden w-10 h-10 p-0 cursor-pointer' variant="ghost">
                  <Stethoscope className='h-4 w-4'/>
                  {/* <UserButton /> */}
                </Button>
              </Link>
            )}
            {user?.role === "PATIENT" &&(
              <>
              <Link href={"/appointments"}>
                <Button className='inline-flex items-center gap-2 cursor-pointer' variant="outline">
                  <Calendar className='w-2 h-0.5 md:w-4 md:h-4' />
                  My Appointments
                  {/* <UserButton /> */}
                </Button>

               <Button className='md:hidden w-10 h-10 p-0 cursor-pointer' variant="outline">
                  <Calendar className='h-4 w-4'/>
                  {/* <UserButton /> */}
                </Button>
              </Link>
                {/* <UserButton /> */}
                </>
            )}
              {user?.role === "UNASSIGNED" &&(
                <Link href={"/onboarding"}>
                  <Button className='hidden md:inline-flex items-center gap-2 cursor-pointer' variant="outline">
                  <User className='w-4 h-4' />
                    Complete Onboarding
                  </Button>

                  <Button className='md:hidden w-10 h-10 p-0 cursor-pointer' variant="ghost">
                  <User className='h-4 w-4'/>
                  {/* <UserButton /> */}
                  
                  </Button>

                </Link>
              )}
               <UserButton />
            </SignedIn>

            {(!user || user?.role === "PATIENT") && (
              <Link href={"/pricing"}>
               <Badge 
                 variant={"outline"}
               className='cursor-pointer h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2'
               >
               <CreditCard className='w-4 h-4 text-emerald-400' />
                <span className=' text-emerald-400 text-xs'>
                  {user && user?.role === "PATIENT" ? (
                    <>
                    {user.creadits}{""}
                    <span className='text-xs'> Credits</span>

                    </>
                  ): (
                    <>
                    Pricing
                    </>
                  )}
                </span>
                </Badge>
                
              </Link>
            )}





    <SignedOut>
  {/* <SignInButton>
    <Button className='cursor-pointer text-emerald-400 border-emerald-700/30 bg-emerald-950/30' variant="secondary">Sign In</Button>
  </SignInButton> */}
  <SignUpButton>
    <Button className='cursor-pointer text-emerald-400 border-emerald-700/30 bg-emerald-950/30' variant="secondary">Sign Up</Button>
  </SignUpButton>
</SignedOut>
              </div> 
        </nav>
        </header>
  )
}

export default Header