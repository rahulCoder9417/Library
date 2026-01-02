"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeBorrowStatus } from "@/lib/admin/actions/deleteUser";

type AdminBorrowProps = {
  status: "BORROWED" | "RETURNED";
  borrowId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
};

const AdminBorrow = ({
  status,
  borrowId,
  borrowDate,
  dueDate,
  returnDate,
}: AdminBorrowProps) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const isOverdue =
    status === "BORROWED" &&
    !returnDate &&
    new Date() > new Date(dueDate);

  const handleStatusChange = async (
    newStatus: "BORROWED" | "RETURNED"
  ) => {
    if (newStatus === status) return;

    await changeBorrowStatus(borrowId, newStatus);
    router.refresh();
    setShow(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className={`px-3 py-2 rounded-2xl font-medium ${
          isOverdue
            ? "bg-red-200 text-red-900"
            : status === "BORROWED"
            ? "bg-gray-200 text-slate-800"
            : "bg-green-200 text-green-900"
        }`}
      >
        {isOverdue ? "OVERDUE" : status}
      </button>

      {show && (
        <div className="absolute z-10 mt-2 w-32 rounded-lg bg-white shadow-lg">
          <button
            onClick={() => handleStatusChange(status === "BORROWED" ? "RETURNED" : "BORROWED")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
          {status === "BORROWED" ? "RETURNED" : "BORROWED"}
          </button>
         
        </div>
      )}
    </div>
  );
};

export default AdminBorrow;
