import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Image } from "@/components/Image";
import { desc, eq } from "drizzle-orm";
import AdminBorrow from "@/components/admin/AdminBorrow";
import DownloadReceipt from "@/components/admin/DownloadRecipt";

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const {page} =  await searchParams;
  let currentPage;
  page ? currentPage=Number(page):currentPage=1;
  const offset = (currentPage - 1) * 10;

  const booksData = await db
  .select({
    userId: borrowRecords.userId,
    id: borrowRecords.id,
    fullName: users.fullName, // Get user's full name
    email: users.email, // Get user's email
    bookId: borrowRecords.bookId,
    title: books.title, // Get book title
    coverUrl: books.coverUrl, // Get book cover URL
    borrowDate: borrowRecords.borrowDate,
    returnDate: borrowRecords.returnDate,
    dueDate: borrowRecords.dueDate,
    status: borrowRecords.status,
  })
  .from(borrowRecords)
  .innerJoin(users, eq(users.id, borrowRecords.userId)) // Correct usage
  .innerJoin(books, eq(books.id, borrowRecords.bookId)) // Correct usage
  .orderBy(desc(borrowRecords.borrowDate))// Sort by latest borrow date
  .limit(10)
  .offset(offset);


  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Borrow Requests</h2>

      </div>

      <div className="flex flex-row h-full hide-scrollbar flex-1 mt-5">
        <Table className="h-full font-medium" >
          <TableHeader>
            <TableRow className="bg-[#ececf4] text-slate-800 rounded-lg">
              <TableHead className="text-slate-800">Book Title</TableHead>
              <TableHead className="text-slate-800">User Requested</TableHead>
              <TableHead className="text-slate-800">Borrowed Date</TableHead>
              <TableHead className="text-slate-800">Return Date</TableHead>
              <TableHead className="text-slate-800">Due Date</TableHead>
              <TableHead className="text-slate-800 text-center">Status</TableHead>
              <TableHead className="text-slate-800 text-center">Recipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {booksData.length > 0 ? (
              booksData.map((book) => (
                <TableRow key={`${book.id}-${book.userId}`}>
                  <TableCell className="font-medium  max-md:text-xs flex gap-2">
                    <Image coverImage={book.coverUrl} title={book.title} />
                    {book.title}</TableCell>
                  <TableCell><span className="block" >{book.fullName}</span>{book.email}</TableCell>
                  <TableCell>{new Date(book.borrowDate).toLocaleDateString()}</TableCell>
                  <TableCell>{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                  {new Date(book.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={`text-center`}>
                    <AdminBorrow dueDate={new Date(book.dueDate).toISOString()} borrowDate={new Date(book.borrowDate).toISOString()} returnDate={book.returnDate ? new Date(book.returnDate).toISOString() : null} status={book.status } borrowId={book.id} />
                  </TableCell>
                  <TableCell className="text-center">
                    <DownloadReceipt user={{fullName:book.fullName,email:book.email}} book={{title:book.title}} borrowDate={new Date(book.borrowDate).toLocaleDateString() } returnDate={book.returnDate && new Date(book?.returnDate).toLocaleDateString() }   />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No books found.
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
        {booksData.length === 10 && (
          <Link href={`?page=${currentPage + 1}`} className="px-3 py-1 bg-gray-300 rounded-md">
            Next
          </Link>
        )}
      </div>
    </section>
  );
}
