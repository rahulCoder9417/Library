import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "./ui/button";

interface Props {
  id: string | undefined;
}

const IsAdminComponent = async ({ id }: Props) => {
  if (!id) return null;

  const result = await db
    .select({ isAdmin: users.role })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  const isAdmin = result[0]?.isAdmin === "ADMIN";

  if (!isAdmin) return null;

  return (
    <li>
      <Button  className="mb-10 max-sm:btn-line relative max-sm:size-10 max-sm:bg-inherit max-sm:text-sm max-sm:hover:bg-inherit max-sm:text-white"  >
      <Link href="/admin">Admin</Link></Button>
    </li>
  );
};

export default IsAdminComponent;
