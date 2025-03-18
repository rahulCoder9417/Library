"use client"
import { redirect } from "next/navigation"


const CreateBook = () => {
  return (
    <div onClick={()=>redirect("/admin/books/new")} className="flex items-start cursor-pointer gap-4 bg-[#F8F8FF] p-4 relative rounded-lg">
    <span className="text-4xl rounded-full bg-white py-2 px-4">
      +
    </span>
    <span className="font-semibold max-md:text-xl text-2xl mt-3">Add New Book</span>
  </div>
  )
}

export default CreateBook