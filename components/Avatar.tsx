"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Avatar = ({name,avatarClass="",redirect="/my-profile"}:{name:string;redirect?:string;avatarClass?:string}) => {
    const userAvatar: string =
   name?.split(" ")[0]?.toUpperCase()[0]  +
    (name?.split(" ")[1]?.toUpperCase()?.[0] ?? "");
    const router = useRouter();
  return (
    <div onClick={()=>router.push(redirect)} className={cn("w-10 mb-10 h-10 cursor-pointer rounded-full bg-gray-200 flex items-center justify-center",avatarClass)}>
    {userAvatar}
  </div>
  )
}

export default Avatar