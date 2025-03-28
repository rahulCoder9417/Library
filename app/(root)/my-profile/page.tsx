import React from "react";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { borrowRecords, users,books } from "@/database/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Avatar from "@/components/Avatar";
import { Image } from "@/components/Image";
import { BadgeCheck } from "lucide-react";

const Page = async () => {

  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in")
  const [user] = await db.select().from(users).where(eq(users.id, session?.user?.id)).limit(1);
  const borrowRecord = await db
  .select({ bookId: borrowRecords.bookId ,dueDate:borrowRecords.dueDate}) // Correct object structure
  .from(borrowRecords)
  .where(eq(borrowRecords.userId, session.user.id));

  const booksData: Book[] = await Promise.all(
    borrowRecord.map(async (record) => {
      const [book] = await db.select().from(books).where(eq(books.id, record.bookId));


      const dueDate = new Date(record.dueDate);
      const currentDate = new Date();
      const diffInDays = Math.ceil((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...book,
        isLoanedBook: true,
        daysLeft: diffInDays < 0 ? "Overdue" : diffInDays, // If negative, it's overdue
      } as Book;
    })
  );


  return (
    <div className="flex max-md:flex-col gap-16  max-w-7xl h-full">
      <section className="h-[100vh]  rounded-lg   relative md:w-[50%]">
        <div className="absolute flex  justify-center left-1/2 -translate-x-1/2 top-[-20px] z-10 bg-slate-600 w-14 h-24 rounded-b-full">
          <div className="bg-slate-950 absolute bottom-6 rounded-lg w-[70%] h-1 "></div>
        </div>
        <div className="min-h-[80%] rounded-3xl flex flex-col items-start pl-8 justify-evenly absolute bg-slate-900 w-full">
          <div className="h-24 flex justify-end items-center w-full ">
            <BadgeCheck className="mr-10 size-10 bg-blue-600 text-white bg-clip-text  " />
          </div>
          <div className="flex gap-5    ">
            <Avatar name={user?.fullName} avatarClass="bg-blue-500 text-white size-16 text-3xl" />
            <div className="mb-5">
               <p className="text-2xl text-white font-semibold block">{user?.fullName}</p>
              <p className="text-white">{user?.email}</p>
            </div>
          </div>
          <div>
            <p className="text-slate-300 ">University Id</p>
            <p className="text-2xl font-semibold text-white">BookWise Library</p>
          </div>
          <div>
            <p className="text-slate-300 ">Student Id</p>
            <p className="text-2xl font-semibold text-white">{user?.universityId}</p>
          </div>
          <Image className="w-full h-56 object-cover" coverImage={user?.universityCard} title="Uni Card" />
        </div>

      </section>


      <BookList title="Borrowed Books" books={booksData} />
    </div>
  );
};
export default Page;
