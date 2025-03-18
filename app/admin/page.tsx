import React from "react";
import { Loader } from "lucide-react"; // Import Lucide's Loader
import NewWeekAnalytics from "@/components/admin/NewWeekAnalytics";
import { getAdminData } from "@/lib/admin/actions/data";
import AdminSection from "@/components/admin/AdminSection";

interface Props {
  total: number;
  change: number;
}

const Page = async () => {
  let books: Props | null = null;
  let borrowedBooks: Props | null = null;
  let users: Props | null = null;

  try {
    books = await getAdminData("book");
    borrowedBooks = await getAdminData("borrowedBook");
    users = await getAdminData("user");
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
  }

  if (!books || !borrowedBooks || !users) {
    return (
      <div className="flex justify-center items-center w-full">
        <Loader className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div>
      <section className="flex gap-10 max-md:gap-2 w-auto">
        {/* Borrowed Books */}
        <NewWeekAnalytics
          title="Borrowed Books"
          number={borrowedBooks.change}
          totalNumber={borrowedBooks.total}
        />

        {/* Total Users */}
        <NewWeekAnalytics
          title="Total Users"
          number={users.change}
          totalNumber={users.total}
        />

        {/* Total Books */}
        <NewWeekAnalytics
          title="Total Books"
          number={books.change}
          totalNumber={books.total}
        />
      </section>


      <section className="bg-inherit mt-10 w-full h-[100vh] flex gap-10 flex-row max-md:flex-col">
        <AdminSection a="borrow"/>
        <AdminSection a="book"/>
      </section>
    </div>
  );
};

export default Page;
