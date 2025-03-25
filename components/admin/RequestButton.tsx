"use client";

import { changeUserStatus } from "@/lib/admin/actions/deleteUser";
import { useRouter } from "next/navigation";
import React from "react";

interface RequestButtonProps {
  id: string;
  status: string |null;
}

const RequestButton = ({ id, status }:RequestButtonProps) => {
  const router = useRouter();

  const handleChangeStatus = async () => {
    const newStatus = status === "APPROVED" ? "PENDING" : "APPROVED";
    await changeUserStatus(id, newStatus);
    router.refresh(); // Refresh page to update status
  };

  return (
    <button
      onClick={handleChangeStatus}
      className={`${
        status === "APPROVED" ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"
      } w-full py-2 font-semibold rounded-2xl max-md:text-xs`}
    >
      {status === "APPROVED" ? "Revoke Account" : "Approve Account"}
    </button>
  );
};

export default RequestButton;
