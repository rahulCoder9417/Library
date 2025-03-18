"use client"
import Avatar from "../Avatar";
import { BorrowedBook } from "./AdminSection";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";



const Card =  ({ borrow_date, user, book }: BorrowedBook) => {

  if (!book || !user) {
    return null; // Handle incomplete data
  }

  return (
    <div className="flex items-start gap-4 bg-[#F8F8FF] p-4 relative rounded-lg">
      
      <div className="w-12 h-16 relative">
  <IKImage
    path={book.cover_image}
    urlEndpoint={config.env.imagekit.urlEndpoint}
    alt={book.title}
    fill
    className="w-full h-full rounded-sm object-cover"
    loading="lazy"
    lqip={{ active: true }}
  />
</div>

        
      <div className="flex-1">
        <h3 className="text-sm font-semibold max-md:text-xs text-gray-800">{book.title}</h3>
        <p className="text-xs text-gray-500">
          By {book.author} • {book.genre}
        </p>
        <div className="flex items-center max-md:items-start max-md:flex-col gap-2 mt-2">
          <span className="text-sm font-medium flex text-gray-700">
            <Avatar name={user.fullname} avatarClass="size-6 mr-3 text-xs mb-0" />
            {user.fullname}
          </span>
          <span className="text-gray-400 text-sm ">
            {new Date(borrow_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="absolute bg-white right-5 p-1 rounded-md">
      <svg
width="20"
height="20"
viewBox="0 0 20 20"
fill="none"
className="max-md:hidden"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M12.9833 9.99993C12.9833 11.6499 11.6499 12.9833 9.99993 12.9833C8.34993 12.9833 7.0166 11.6499 7.0166 9.99993C7.0166 8.34993 8.34993 7.0166 9.99993 7.0166C11.6499 7.0166 12.9833 8.34993 12.9833 9.99993Z"
  stroke="#475569"
  strokeWidth="1.5"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
<path
  d="M9.99987 16.8918C12.9415 16.8918 15.6832 15.1584 17.5915 12.1584C18.3415 10.9834 18.3415 9.00843 17.5915 7.83343C15.6832 4.83343 12.9415 3.1001 9.99987 3.1001C7.0582 3.1001 4.31654 4.83343 2.4082 7.83343C1.6582 9.00843 1.6582 10.9834 2.4082 12.1584C4.31654 15.1584 7.0582 16.8918 9.99987 16.8918Z"
  stroke="#475569"
  strokeWidth="1.5"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
</svg>
      </div>
    </div>
  );
};
export default Card;

