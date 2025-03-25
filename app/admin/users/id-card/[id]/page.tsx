import UniversityCard from "@/components/admin/UniversityCard";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import config from "@/lib/config";
import { eq } from "drizzle-orm";
import { IKImage } from "imagekitio-next";
import Link from "next/link";

const UserPage = async ({ params }: { params: { id: string } }) => {
  const user = await db
    .select({ universityCard: users.universityCard })
    .from(users)
    .where(eq(users.id, params.id))
    .limit(1);

  if (!user.length) {
    return <p className="text-center text-red-500 mt-10">User not found</p>;
  }

  const universityCard = user[0].universityCard;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">University ID Card</h1>

      {universityCard ? <UniversityCard path={universityCard} /> : <p>No image available</p>}

      <Link href="/admin/users">
        <button className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
          Go Back
        </button>
      </Link>
    </div>
  );
};

export default UserPage;
