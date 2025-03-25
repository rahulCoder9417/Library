"use client"
import config from '@/lib/config'
import { cn } from '@/lib/utils'
import { IKImage } from 'imagekitio-next'
import React from 'react'

export const Image = ({coverImage,title,className=""}:{coverImage:string;title:string;className?:string}) => {
  return (   <>
  <div className={cn("w-12 relative  h-12",className)}>
  <IKImage
    path={coverImage}
    urlEndpoint={config.env.imagekit.urlEndpoint}
    alt={title}
    fill
    className="w-full h-full absolute object-cover rounded-sm"
    loading="lazy"
    lqip={{ active: true }}
  />
</div>

    </>
  )
}
