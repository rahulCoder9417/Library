"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { deleteBook, deleteUser } from "@/lib/admin/actions/deleteUser";

export default function DeleteUser({ id,type="user" }: { id: string;type?:string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this ?");
    if (!confirmed) return;

    setLoading(true);
    if(type==="user"){
      await deleteUser(id);
    }else{
      await deleteBook(id);
    }
    setLoading(false);
    router.refresh(); // Refresh page after deletion
  };

  return (
    <button onClick={handleDelete} className="hover:opacity-75" disabled={loading}>
      {loading ? "Deleting..." : <img src="/icons/admin/trash.svg" alt="Trash Icon" width={24} height={24} />}
    </button>
  );
}
