// AdminSection.tsx (server component)
import React from "react";
import Card from "./Card";
import {
  getActiveBorrowRecords,
  getLatestBooks,
  getUsers,
} from "@/lib/admin/actions/data";
import LatestBookCard from "./LatestBookCard";
import Avatar from "../Avatar";
import { cn } from "@/lib/utils";
import CreateBook from "./CreateBook";
interface User {
  email: string;
  fullname: string;
}

interface LocalBook {
  cover_image: string;
  genre: string;
  author: string;
  title: string;
}

export interface BorrowedBook {
  borrow_date: Date;
  user: User | null;
  book: LocalBook | null;
}

interface AdminSectionProps {
  a: string;
}

const AdminSection = async ({ a }: AdminSectionProps) => {
  let data: BorrowedBook[] | null = null;
  let latestBooks: Book[] | null = null;
  let latestUsers: { fullName: string; email: string }[] | null = null;
  if (a === "book") {
    latestBooks = await getLatestBooks();
    console.log(latestUsers);
  }else {
    try {
      
    latestUsers = await getUsers();
      data = await getActiveBorrowRecords();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg hide-scrollbar overflow-y-auto bg-white flex-col w-auto p-5 flex gap-4 flex-1">
        <div className="flex items-center justify-between font-semibold w-full">
          <div className="text-2xl max-md:text-xl">
            {a === "borrow" ? "Borrow Request" : "Recently Added Books"}
          </div>
          <button className="bg-blue-300 text-[#25388C] px-4 py-2 max-md:text-sm rounded-md hover:bg-blue-400">
            View All
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {a === "book" && (
            <CreateBook/>
          )}
          {a === "borrow"
            ? data?.length ===0 ?
            <div className="flex flex-col items-center justify-center gap-5">
           <img src="icons/admin/Norequest.svg" className="max-md:size-32"/>
           <h1 className="font-semibold text-2xl max-md:text-base">No Book Borrowing request</h1>
            </div>
            :data?.map((item, index) => (
              <Card
                key={index}
                user={item.user}
                book={item.book}
                borrow_date={item.borrow_date}
              />
            ))
            : latestBooks?.map((item, index) => (
                <LatestBookCard key={index} book={item} />
              ))}
        </div>
      </div>
      <div
        className={cn(
          `rounded-lg hide-scrollbar  overflow-y-auto bg-white flex-col w-auto p-5  gap-4 flex-1 ${a === "book" ? "hidden" :"flex"} `
        )}
      >
        <div className="flex items-center justify-between font-semibold w-full ">
          <div className="text-2xl max-md:text-xl">Account Request</div>
          <button className="bg-blue-300 text-[#25388C] px-4 py-2 max-md:text-sm rounded-md hover:bg-blue-400">
            View All
          </button>
        </div>
        <div className={` ${latestUsers?.length!==0 ? "grid grid-cols-3 gap-5" :"flex items-center min-h-[120px] justify-evenly flex-col" } `}>
          {latestUsers?.length!==0? latestUsers?.map((item, i) => (
            <div className="bg-[#F8F8FF] rounded-2xl overflow-hidden flex items-center min-h-[120px] justify-evenly flex-col " key={i}>
              <Avatar avatarClass="mt-5 bg-blue-400" name={item.fullName} />
              <h2 className="max-md:text-sm text-center">{item.fullName}</h2>
              <h1 className="text-gray-600 max-md:text-xs">{item.email}</h1>
            </div>
          )): <div className="flex flex-col items-center justify-center gap-5">
          <img src="icons/admin/Norequest.svg" className="max-md:size-32"/>
          <h1 className="font-semibold text-2xl max-md:text-base">No Account request</h1>
           </div>}
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
