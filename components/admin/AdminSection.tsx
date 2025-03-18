// AdminSection.tsx (server component)
import React from "react";
import Card from "./Card";
import { getActiveBorrowRecords, getLatestBooks } from "@/lib/admin/actions/data";
import LatestBookCard from "./LatestBookCard";
interface User {
  email: string;
  fullname: string;
}

export interface BorrowedBook {
  borrow_date: Date;
  user: User | null;
  book: Book | null;
}

interface AdminSectionProps {
  a: string;
}

const AdminSection = async ({ a }: AdminSectionProps) => {
  let data: BorrowedBook[] | null = null;
  let latestBooks: Book[] | null = null;

  if (a === "book") {
    latestBooks = await getLatestBooks();
    console.log("Latest Books:", latestBooks);
  } else {
    try {
      data = await getActiveBorrowRecords();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="rounded-lg hide-scrollbar overflow-y-auto bg-white flex-col w-auto p-5 flex gap-4 flex-1">
      <div className="flex items-center justify-between font-semibold w-full">
        <div className="text-2xl">
          {a === "borrow" ? "Borrow Request" : "Recently Added Books"}
        </div>
        <button className="bg-blue-300 text-[#25388C] px-4 py-2 max-md:text-sm rounded-md hover:bg-blue-400">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {a === "book" && (
          <div className="flex items-start gap-4 bg-[#F8F8FF] p-4 relative rounded-lg">
            <span className="text-4xl rounded-full bg-white py-2 px-4">+</span>
            <span className="font-semibold text-2xl mt-3">Add New Book</span>
          </div>
        )}
        {a === "borrow"
          ? data?.map((item, index) => (
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
  );
};

export default AdminSection;
