import Pricing from '@/components/pricing'
import { ArrowLeft, Badge } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PricingPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex justify-start mb-2">
            <Link href={"/"} className="flex items-center text-muted-foreground hover:text-white transition-colors duration-300">
                
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
                
            </Link>
        </div>
        <div className="text-center mb-12 max-w-full mx-auto">
            <Badge fontVariant={"outline"} className='bg-emerald-900/30 border-emerald-700/30 px-4 py-2 mb-4 text-emerald-400 text-sm font-medium'>
                Affordable Healthcare Management
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Pricing Plans
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8">
                Choose a plan that fits your healthcare needs. Our flexible pricing options ensure you get the best value for your healthcare management.
            </p>
        </div>
        <Pricing />
        <div className="text-center mt-12">
            <Badge className='bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium'>
                Need Help?
            </Badge>
            <p className="text-muted-foreground text-lg md:text-xl mt-4">
                If you have any questions about our pricing or need assistance, feel free to contact our support team.
            </p>
            <Link href="/contact" className="text-emerald-400 hover:underline mt-4 inline-block">
                Contact Support
            </Link>
            </div>
    </div>
  )
}

export default PricingPage