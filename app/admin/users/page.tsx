import {inArray } from "drizzle-orm";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import { db } from "@/database/drizzle";
import { borrowRecords, users } from "@/database/schema";
import UsersRole from "@/components/admin/UsersRole";
import DeleteUser from "@/components/admin/DeleteUser";

const USERS_PER_PAGE = 10;

const fetchUsers = async (page: number) => {
  const offset = (page - 1) * USERS_PER_PAGE;

  // Fetch paginated users
  const usersList = await db.select().from(users).limit(USERS_PER_PAGE).offset(offset);

  // Get user IDs from fetched users
  const userIds = usersList.map((user) => user.id);

  // Fetch books borrowed for all users in the current page
  const booksBorrowed = await db
    .select({ userId: borrowRecords.userId })
    .from(borrowRecords)
    .where(inArray(borrowRecords.userId, userIds));
    
  const booksCountMap = userIds.reduce((acc, id) => {
    acc[id] = booksBorrowed.filter((record) => record.userId === id).length;
    return acc;
  }, {} as Record<string, number>);

  const usersWithBooks = usersList.map((user) => ({
    ...user,
    books_borrowed: booksCountMap[user.id] || 0, 
  }));
  return usersWithBooks;
};
const Page = async ({ searchParams }: { searchParams?: { page?: string } }) => {
 //@ts-ignore
  const {page} =  await searchParams;
  let currentPage;
  page ? currentPage=Number(page):currentPage=1;
  const usersData = await fetchUsers(currentPage);

  return (
    <section className="bg-white flex-1 m-4 max-md:m-1 rounded-lg p-8">
      <h1 className="text-2xl font-semibold">All Users</h1>
      <div className="flex flex-row h-full hide-scrollbar flex-1 mt-5">
        <Table className="">
          <TableHeader>
            <TableRow className="bg-[#ececf4] text-slate-800 rounded-lg">
              <TableHead className="text-slate-800">Name</TableHead>
              <TableHead className="text-slate-800">Date Joined</TableHead>
              <TableHead className="text-slate-800">Role</TableHead>
              <TableHead className="text-slate-800">University ID No</TableHead>
              <TableHead className="text-slate-800">University ID Card</TableHead>
              <TableHead className="text-slate-800">Books Borrowed</TableHead>
              <TableHead className="text-slate-800">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData?.length > 0 ? (
              usersData?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    
                  <UsersRole role={user?.role} id={user.id} />

                  </TableCell>
                  <TableCell className="font-semibold">{user.universityId}</TableCell>
                  <TableCell className="text-blue-700 text-left">
                    <Link href={`/admin/users/id-card/${user.id}`}>View ID Card</Link>
                  </TableCell>
                  <TableCell className="font-semibold">{user.books_borrowed}</TableCell>
                  <TableCell className="text-center">
                    <DeleteUser id={user.id}  />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        {currentPage > 1 && (
          <Link href={`?page=${currentPage - 1}`} className="px-3 py-1 bg-gray-300 rounded-md">
            Previous
          </Link>
        )}
        {usersData.length === USERS_PER_PAGE && (
          <Link href={`?page=${currentPage + 1}`} className="px-3 py-1 bg-gray-300 rounded-md">
            Next
          </Link>
        )}
      </div>
    </section>
  );
};

export default Page;
