"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeBorrowStatus } from "@/lib/admin/actions/deleteUser";

const AdminBorrow = ({ status, borrowId }: { status: string; borrowId: string }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: "BORROWED" | "RETURNED" ) => {
    if (newStatus === status) return; // No need to update if the same status

    await changeBorrowStatus(borrowId, newStatus); // Update status in DB
    router.refresh(); // Refresh page to reflect changes
    setShow(false); // Close dropdown
  };

  return (
    <div className="relative">
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setShow(!show)}
        className={`px-3 py-2 rounded-2xl ${
          status === "BORROWED" ? "bg-gray-200 text-slate-800" : "bg-orange-200 text-red-800"
        }`}
      >
        {status}
      </button>

      {/* Dropdown Menu */}
      {show && (
        <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2 w-32">
          <button
            onClick={() => handleStatusChange("BORROWED")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            BORROWED
          </button>
          <button
            onClick={() => handleStatusChange("RETURNED")}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            RETURNED
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBorrow;
