"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Check, ChevronDown, Loader2, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { creditBenefits, faqs, features, testimonials } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Pricing from "@/components/pricing";
import { allocateCredits } from "@/actions/credits";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { verifyDrugByNafdac } from "@/actions/drugsverification";
import { Textarea } from "@/components/ui/textarea";
import { recommendSpecialtyAI } from "@/actions/symptom-checker";





export default function Home() {

// await new Promise(resolve => setTimeout(resolve, 5000));
const [open, setOpen] = useState(false);
const [openModal, setOpenModal] = useState(false);
const [input, setInput] = useState("");
const [nafdacNumber, setNafdacNumber] = useState("");
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [isloading, setIsLoading] = useState(false);
const [aiResult, setAiResult] = useState("");
const [openIndex, setOpenIndex] = useState(null);

console.log(aiResult);


const toggleFaq = (index:any)=>{
  setOpenIndex(openIndex === index ? null : index)
}
 const handleCheck = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if(isloading) return;

  if (!input.trim()) {
      toast.error("Please describe your symptoms first.");
      return;
    }

    setIsLoading(true);
   try {
    const data= await recommendSpecialtyAI(input);

    if (data.success) {
      // toast.success(result.message);
      setAiResult(data.message);
      setOpenModal(true);
      console.log(data.message);
    } else {
      toast.error(data.message);
      // setOpenModal(true);
    }
   } catch (error:any) {
    toast.error(error.message || "An error occurred during while analyzing");
   }finally{
    setIsLoading(false);
    setInput("");
   }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nafdacNumber.trim()) {
      toast.error("Please enter a NAFDAC number");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyDrugByNafdac(nafdacNumber);

      if (res.success) {
        setResult(res.data);
        toast.success("Drug verification successful!");
        console.log("Drug details:", res.data);
       
      } else {
        toast.error("Failed to verify drug");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during verification");
    } finally {
      setLoading(false);
      setResult(null);
    }
  };
 
  return (
    
    <div className="bg-background">
<Card className='pt-20 w-full bg-muted/50 border border-emerald-600'>
      <div className="p-6 md:flex md:items-center md:justify-between gap-2">
      <div>
      <form onSubmit={handleCheck}>
      <h2 className="text-xl font-bold mb-2">AI Symptom Checker</h2>
      <Textarea
        className="border border-emerald-600 p-3 rounded"
        rows={4}
        placeholder="Describe how you feel..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></Textarea>
      <Button
        type="submit"
        disabled={isloading}
        className="bg-emerald-500 text-white text-md px-8 py-6 md:py-4 mt-4 rounded hover:bg-emerald-700 "
      >
        {isloading ?( 
          <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
          Analyzing...
          </>
          ) : ("Check")}
      </Button>

      </form>

      </div>

      <div className='pt-10'>
             <Button
             type="button"
        onClick={()=>setOpen(true)}
        disabled={loading}
        className="border border-emerald-800 bg-muted/20 text-emerald-400 text-md px-4 py-6 mt-2 rounded hover:bg-emerald-800 w-full"
      >
       Verify Drugs
      </Button>
      </div>
    </div>
</Card>

    <section className="relative overflow-hidden py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant={"outline"}
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium">HeaalthCare made simple</Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">Connect With Verified Doctors,
           <span className="gradient-title"> Anytime, Anywhere.</span></h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-md">Book appointments, 
            consult via video call, Nafdac drug 
            verification, sympthom check and manage your 
            healthcare journey all in one secure platform.</p>

            <div className="flex flex-row items-center gap-4">
              <Button asChild size={"lg"} className="bg-emerald-500 hover:bg-emerald-700 text-white">
                
              <Link href={"/onboarding"}>
                Get Started <ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
              </Button>

              <Button asChild size={"lg"} variant={"outline"} className=" border-emerald-700/30 hover:bg-muted/80 hover:text-white text-emerald-500 bg-transparent">
                <Link href="/doctors">
                Find Doctors<ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] lg:h-[500px] xl:h-[700px] rounded-xl overflow-hidden">
            <Image src={"/assets/images/onboarding-img.png"}
             alt="Onboarding img"
             fill
             sizes={"100%"}
             priority
             className="object-cover md:pt-14 rounded-xl"/>
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 bg-muted/50 dark:bg-muted/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-8">Why Choose DocLink?</h2>
          <p className="text-muted-foreground text-lg md:text-xl text-center max-w-2xl mx-auto mb-12">
            Experience a new era of healthcare management with our comprehensive platform designed to simplify your health journey.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((item,index)=>(
            <Card key={index} className="border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">{item.icon}</div>
                <CardTitle className="text-xl font-semibold text-white">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-8">Subscription Plans</h2>
          <p className="text-muted-foreground text-lg md:text-xl text-center max-w-2xl mx-auto mb-12">
            Choose a plan that fits your healthcare needs.
          </p>
        </div>
        
       <div>
        <Pricing />
        <Card className="mt-12 border-amber-800 hover:border-amber-800/40 bg-amber-900/20">
              <CardHeader className="pb-2">

                <CardTitle className="text-sm md:text-xl font-bold text-white flex items-center justify-center md:justify-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
                    How Our Credit System Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">

                {
                  creditBenefits.map((item,index)=>(
                    <li key={index} className="flex items-start">
                  <div className="gap-3 mr-3 p-2 bg-emerald-900/20 rounded-full">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-muted-foreground text-sm md:text-balance" dangerouslySetInnerHTML={{__html: item}}/>
                   </li> 
                  ))
                }
                </ul>
                </CardContent>
            </Card>
       </div>
      </div>
    </section>


    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant={"outline"}
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 mb-4 text-emerald-400 text-sm font-medium">Success Stories</Badge>   
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-8">
          What Our Users Say
                </h2>
          <p className="text-muted-foreground text-lg md:text-xl text-center max-w-2xl mx-auto mb-12">             
            Hear from our satisfied users who have transformed their healthcare experience with DocLink.
          </p>
        </div>
        

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {testimonials.map((item,index)=>(
        <Card key={index} className="mt-12 border-emerald-900/30 hover:border-emerald-800/40 bg-muted/20 transition-all duration-300">

            <CardContent className="p-6">

                <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12
                 rounded-full bg-emerald-900/20 flex
                  items-center justify-center text-2xl
                   font-bold text-emerald-400 mr-4">
                <span>{item.initials}</span>  
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">{item.role}&quote;</p>
                </div>
                  </div> 
                <p className="text-muted-foreground mt-4">&quot;{item.testimonial}</p>             
              </CardContent>
            </Card>
              ))}
       </div>
      </div>
    </section>



    <section className="py-20 bg-muted/50 dark:bg-muted/80">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-emerald-900/30 border-emerald-900/30 hover:border-emerald-800/40 transition-all duration-300">
          <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Ready to Transform Your Healthcare Experience?</h2>
                <p className="text-muted-foreground text-lg md:text-xl mb-6">Join thousands of satisfied users and take control of your health today.</p>
               
               <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">

                <Button asChild size={"lg"} className="bg-emerald-500 hover:bg-emerald-700 text-white w-full md:w-auto">
                  <Link href="/sign-up">
                    Get Started Now 
                  </Link>
                </Button>

                <Button asChild size={"lg"} variant={"outline"}
                 className="border-emerald-700/30 hover:bg-muted/80
                 hover:text-white text-emerald-500 bg-transparent ml-4">
                  <Link href="/pricing">
                    View pricing 
                  </Link>
                </Button>
                    </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </section>




  <section className="py-20 bg-muted/50 dark:bg-muted/80">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-muted-900 border-emerald-900 ">
          <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="max-w-xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                
               
               <div className="space-y-6">
                {faqs.map((item,index)=>(
                  <div key={index} className='border border-emerald-800 rounded-xl'>

                <Button onClick={()=>toggleFaq(index)} variant={"outline"} size={"lg"} className="w-full flex items-center text-left p-4 justify-between bg-muted/20 cursor-pointer">
                <span className="font-medium text-gray-300 text-sm md:text-xl">{item.question}</span>
                <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform ${openIndex === index ? "rotate-180" : "" }`}/>
                </Button>
                {openIndex === index &&(
                  <div className='p-4 bg-gray-800 text-gray-400 text-sm'>{item.answer}</div>
                )}
                  </div>
                ))}

            
                    </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </section>


<Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="flex flex-col items-center justify-center">
    
    <DialogHeader>
    <DialogTitle className='text-xl font-bold gradient-title text-center'>Verify your drug</DialogTitle>

    <DialogDescription>
  Please enter your drug NAFDAC number to verify
    </DialogDescription>
    </DialogHeader>
    <form onSubmit={handleSearch}>
    <Input placeholder="06-4986"
            value={nafdacNumber}
            onChange={(e)=>setNafdacNumber(e.target.value)}
            className='w-full p-5'
            />
              <Button
              size={"sm"}
              type="submit"
        disabled={loading}
        className="bg-emerald-600 text-white px-4 py-2 rounded font-medium hover:bg-emerald-700 disabled:opacity-50 w-full my-5"
      >
        {loading ?(
          <>
          <Loader2 className='h-4 w-4 mr-2 animate-spin'/>
           Verifying...
           </>
            ):( "Verify Drug")}
      </Button>

      </form>
 
            <Card>
<CardContent>{result}</CardContent>
            </Card>
          
</DialogContent>
</Dialog>


{/* AI Result */}
<Dialog open={openModal} onOpenChange={setOpenModal}>
    <DialogContent className="flex flex-col items-center justify-center">
     <DialogHeader>
    <DialogTitle className='text-xl font-bold gradient-title text-center'>Successful Reponse!</DialogTitle>

    <DialogDescription>
  Kindly visit the doctors page to book an appointment the recommended specialty.
    </DialogDescription>
    </DialogHeader>
   
      {aiResult}
</DialogContent>
</Dialog>



      </div>

  );
}
