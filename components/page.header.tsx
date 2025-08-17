import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'

type PageHeaderProps = {
  icon?: React.ReactElement<any>;
    title?: string;
    backLink?: string;
    backLabel?: string;
}

const PageHeader = ({icon, title, backLink = "/", backLabel = "Back to Home"} : PageHeaderProps) => {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-between mb-4'>
        <Link href={backLink} className='flex text-2xl font-bold text-primary self-start'>
        <Button variant="outline" size={"sm"} className='mb-2 border-emerald-900/30 hover:border-emerald-800/40'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            {backLabel}
        </Button>
        </Link>

        <div className='flex items-center gap-4'>
            {icon && (
                <div className='text-emerald-400'>
                   {React.cloneElement(icon, {
                         className: 'h-8 md:h-16 w-8 md:w-14' 

                    })}
                    </div>
  )}
   <h1 className='text-sm md:text-3xl font-bold gradient-title mt-2'>
                {title}
            </h1>
  </div>
    </div>
  )
}

export default PageHeader