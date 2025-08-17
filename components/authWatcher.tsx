"use client"
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { toast } from "sonner";


export default function AuthWatcher(){
    const {isSignedIn } = useAuth();

    useEffect(()=>{
        if(isSignedIn === false){
            toast.warning("Kindly sign in to continue")
        }
    },[isSignedIn]);
    return null;
}