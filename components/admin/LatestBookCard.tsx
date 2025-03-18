// LatestBookCard.tsx (client component)
"use client";
import React from "react";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";

interface LatestBookCardProps {
  book: Book;
}

const LatestBookCard = ({ book }: LatestBookCardProps) => {
  if (!book) return null; // handle incomplete data

  return (
    <div className="flex items-start gap-4 bg-[#F8F8FF] p-4 relative rounded-lg">
      <div className="w-12 h-16 relative">
        <IKImage
          path={book.coverUrl}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt={book.title}
          fill
          className="w-full h-full rounded-sm object-cover"
          loading="lazy"
          lqip={{ active: true }}
        />
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold max-md:text-xs text-gray-800">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500">
          By {book.author} • {book.genre}
        </p>
        <div className="flex items-center max-md:items-start max-md:flex-col gap-2 mt-2">
          <span className="text-gray-400 text-sm">
            {/* @ts-ignore */}
          {new Date(book.createdAt).toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
})}

          </span>
        </div>
      </div>
    </div>
  );
};

export default LatestBookCard;
