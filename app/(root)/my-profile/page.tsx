import React from "react";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";

const Page = () => {
  return (
    <div className="flex gap-16 w-full h-full">
      <section className="h-[100vh] relative w-[50%]">
        <div className="absolute left-1/2 bottom-[-1px] z-10 bg-slate-600 w-10 h-16 rounded-b-full"></div>
        <div className="min-h-[80%] absolute bg-slate-900 w-full"></div>
      </section>
      
      <BookList title="Borrowed Books" books={sampleBooks} />
      </div>
  );
};
export default Page;
