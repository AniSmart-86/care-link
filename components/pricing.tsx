import React from 'react'
import { Card, CardContent } from './ui/card'
import { PricingTable } from '@clerk/nextjs'

const Pricing = () => {
  return (
   <Card className="bg-muted/50 dark:bg-muted/80 p-8">
    <CardContent className='p-6 md:p-8'>
        <PricingTable checkoutProps={{
            appearance: {
                elements:{
                    drawerRoot:{
                        zIndex: 9999, // Ensure the drawer is on top of other elements
                    }
                }
            }
        }}
        />
    </CardContent>
   </Card>
  )
}

export default Pricing