import React from "react";
import NewWeekAnalytics from "@/components/admin/NewWeekAnalytics"
const Page = () => {
  return <div>
    <section className="flex gap-10 w-auto">
      <NewWeekAnalytics/>
      <NewWeekAnalytics/>
      <NewWeekAnalytics/>
    </section>
  </div>;
};
export default Page;
