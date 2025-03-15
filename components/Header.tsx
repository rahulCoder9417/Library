import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import Avatar from "./Avatar";
import IsAdminComponent from "./IsAdminComponent";
const Header = async({session}:{session:Session}) => {
 
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <IsAdminComponent id={session?.user?.id} />
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
          {session?.user?.name && <Avatar session={session}/>}
        </li>
      </ul>
    </header>
  );
};

export default Header;
