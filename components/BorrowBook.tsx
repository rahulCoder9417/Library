"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook, returnBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  borrowedBook: BorrowRecord | undefined;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({
  borrowedBook,
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false)
  const [isReturning, setIsReturning] = useState(false)

  useEffect(() => {
  if (borrowedBook && borrowedBook.status === "BORROWED") {
      setIsBorrowed(true);
    } else {
      setIsBorrowed(false);
    }
  }, [borrowedBook]);


  const handleBorrowBook = async () => {
    if (isBorrowed) {
      setIsReturning(true);
      try {
        const result = await returnBook({ bookId, userId });
  
        if (result.success) {
          toast({
            title: "Success",
            description: "Book Returned successfully",
          });
          setIsBorrowed(false);
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while returning the book",
          variant: "destructive",
        });
      } finally {
        setIsReturning(false);
      }
      return;
    }
    if (!isEligible) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({ bookId, userId });

      if (result.success) {
        toast({
          title: "Success",
          description: "Book borrowed successfully",
        });
        
        setIsBorrowed(true)
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while borrowing the book",
        variant: "destructive",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Button
      className={`book-overview_btn ${isBorrowed ? "!bg-blue-500 hover:!bg-blue-600" : ""} `}
      onClick={handleBorrowBook}
      disabled={borrowing}
    >
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {isBorrowed ? isReturning ? "Returning ..." : "Return Book" : borrowing ? "Borrowing ..." : "Borrow Book"}

      </p>
    </Button>
  );
};
export default BorrowBook;
