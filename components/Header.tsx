
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import Avatar from "./Avatar";
import IsAdminComponent from "./IsAdminComponent";
const Header = async({session}:{session:Session}) => {
 
  return (
    <header className="my-10 flex  justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <IsAdminComponent id={session?.user?.id} />
        <li>
          <Button className="mb-10 max-sm:btn-line relative max-sm:size-10 max-sm:bg-inherit max-sm:text-sm max-sm:hover:bg-inherit max-sm:text-white" variant="secondary" asChild>
          <Link href="/library">Library</Link>
          </Button>
        </li>
        <li>
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
            className="mb-10"
          >
            <Button className="max-sm:size-10 max-sm:btn-line relative max-sm:bg-inherit max-sm:text-sm max-sm:hover:bg-inherit max-sm:text-white" variant="secondary">Logout</Button>
          </form>
          </li>
          <li>
          {session?.user?.name && <Avatar name={session.user.name}/>}
        </li>
      </ul>
    </header>
  );
};

export default Header;
