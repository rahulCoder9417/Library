import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
const Header = ({session}:{session:Session}) => {
  const userAvatar: string =
  session?.user?.name?.split(" ")[0]?.toUpperCase()[0]  +
  (session?.user?.name?.split(" ")[1]?.toUpperCase()?.[0] ?? "");
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
            className="mb-10"
          >
            <Button>Logout</Button>
          </form>
          </li>
          <li>
          {session?.user?.name && <div className="w-10 mb-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {userAvatar}
          </div>}
        </li>
      </ul>
    </header>
  );
};

export default Header;
