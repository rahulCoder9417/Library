"use client"
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import Link from 'next/link';
import React from 'react'

const IsAdminComponent = async({id}:{id:string | undefined}) => {
  
    const [isAdmin, setisAdmin] = React.useState(false)
    const Admin = await db
      .select({ isAdmin: users.role })
      .from(users)
      //@ts-ignore
      .where(eq(users.id, id))
      .limit(1)
      .then((res) => res[0]?.isAdmin === "ADMIN");
  
      if (Admin) {
        setisAdmin(true)
      }
    return (
        <>
            {isAdmin && <li>
                <Link href="/admin">Admin</Link>
            </li>}
        </>
    )
  
}

export default IsAdminComponent