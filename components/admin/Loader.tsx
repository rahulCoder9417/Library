import { cn } from '@/lib/utils'
import React from 'react'
interface Props{
    containerClasses:String
}
const Loader = ({containerClasses}:Props) => {
  return (
    <div className={cn("gradient-gray",containerClasses)} >
      
    </div>
  )
}

export default Loader
