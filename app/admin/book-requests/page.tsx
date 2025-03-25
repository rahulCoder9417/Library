import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Image } from "@/components/Image";
import DeleteUser from "@/components/admin/DeleteUser";


export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const {page} =  await searchParams;
  let currentPage;
  page ? currentPage=Number(page):currentPage=1;
  const offset = (currentPage - 1) * 10;

  const booksData = await db
    .select({
      title:borrowRecords.
    })
    .from(borrowRecords)
    .limit(10)
    .offset(offset);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Borrow Requests</h2>

      </div>

      <div className="flex flex-row h-full hide-scrollbar flex-1 mt-5">
        <Table className="h-full">
          <TableHeader>
            <TableRow className="bg-[#ececf4] text-slate-800 rounded-lg">
              <TableHead className="text-slate-800">Book Title</TableHead>
              <TableHead className="text-slate-800">User Requested</TableHead>
              <TableHead className="text-slate-800">Borrowed Date</TableHead>
              <TableHead className="text-slate-800">Return Date</TableHead>
              <TableHead className="text-slate-800">Due Date</TableHead>
              <TableHead className="text-slate-800">Status</TableHead>
              <TableHead className="text-slate-800">Recipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {booksData.length > 0 ? (
              booksData.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium flex gap-2">
                    <Image coverImage={book.bookCover} title={book.title} />
                    {book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                  <Link href={`/books/${book.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                  <DeleteUser id={book.id} type="book" />
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
