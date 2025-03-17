import { auth } from "@/auth";
import Header from "@/components/Header";
import LibraryHeader from "@/components/LibraryHeader";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
    const session = await auth();
  
    if (!session) redirect("/sign-in");
  
    return (
        <main className="root-container">
            
          <Header session={session} />
        <div className="mx-auto max-w-7xl">
  
          <div className="mt-10 pb-20">{children}</div>
        </div>
      </main>
    )}

export default Layout;