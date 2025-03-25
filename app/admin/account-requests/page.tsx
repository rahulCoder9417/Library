
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import Link from "next/link";
  import { allUser } from "@/lib/admin/actions/deleteUser";
  import RequestButton from "@/components/admin/RequestButton";
  
  const USERS_PER_PAGE = 10;
  
  const Page = async ({ searchParams }: { searchParams?: { page?: string } }) => {
    //@ts-ignore
    const {page} =  await searchParams;
    let currentPage;
    page ? currentPage=Number(page):currentPage=1;
    const usersData = await allUser(USERS_PER_PAGE, (currentPage - 1) * USERS_PER_PAGE);
  
  
  
    return (
      <section className="bg-white flex-1 m-4 max-md:m-1 rounded-lg p-8">
        <h1 className="text-2xl font-semibold">Account Registration Requests</h1>
        <div className="flex flex-row h-full hide-scrollbar flex-1 mt-5">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#ececf4] text-slate-800 rounded-lg">
                <TableHead>Name</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>University ID No</TableHead>
                <TableHead>University ID Card</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData?.length > 0 ? (
                usersData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="font-semibold">{user.universityId}</TableCell>
                    <TableCell className="text-blue-700">
                      <Link href={`/admin/users/id-card/${user.id}`}>View ID Card</Link>
                    </TableCell>
                    <TableCell className="font-semibold">{user.status}</TableCell>
                    <TableCell className="text-center">
                     <RequestButton id={user.id} status={user.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
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
  