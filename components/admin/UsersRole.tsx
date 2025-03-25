"use client";
import React, { useState } from "react";

const UsersRole = ({ role, id }: { role: "USER" | "ADMIN" |null; id: string }) => {
  const [currentRole, setCurrentRole] = useState(role);
  const [showBox, setShowBox] = useState(false);

  // Call API to update role
  const changeRole = async (newRole: "USER" | "ADMIN") => {
    try {
      const res = await fetch("/api/changeRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role: newRole }),
      });

      if (res.ok) {
        setCurrentRole(newRole); // Update UI
        setShowBox(false);
      } else {
        console.error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowBox(!showBox)}
        className={`${
          currentRole === "ADMIN"
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-800"
        } rounded-2xl px-2 text-center font-medium py-1`}
      >
        {currentRole}
      </button>

      {showBox && (
        <div className="absolute right-[-9px] w-40 rounded-lg bg-white flex gap-5 flex-col px-5 z-10 border border-gray-300 shadow-lg">
          <h1 className="mt-2 font-semibold">Change role</h1>
          <hr />
          <button
            onClick={() => changeRole("ADMIN")}
            className="bg-green-200 text-green-800 rounded-2xl px-2 text-center font-medium py-1 shadow-md"
          >
            ADMIN
          </button>
          <button
            onClick={() => changeRole("USER")}
            className="bg-red-200 text-red-800 rounded-2xl px-2 text-center font-medium py-1 shadow-md"
          >
            USER
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersRole;
