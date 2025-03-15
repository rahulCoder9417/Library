"use client";

import { Session } from "next-auth";
import { useRouter } from "next/navigation";

const Avatar = ({session}:{session:Session}) => {
    const userAvatar: string =
    session?.user?.name?.split(" ")[0]?.toUpperCase()[0]  +
    (session?.user?.name?.split(" ")[1]?.toUpperCase()?.[0] ?? "");
    const router = useRouter();
  return (
    <div onClick={()=>router.push("/my-profile")} className="w-10 mb-10 h-10 cursor-pointer rounded-full bg-gray-200 flex items-center justify-center">
    {userAvatar}
  </div>
  )
}

export default Avatar