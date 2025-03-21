"use client";
import React, { useState, useEffect } from 'react';
import LibraryHeader from '@/components/LibraryHeader';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookList from '@/components/BookList';

const Page = () => {
  const [value, setValue] = useState('');
  const [sortBy, setSortBy] = useState('Oldest');
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [value, sortBy]);
  useEffect(() => {
    const fetchBooksData = async () => {
     
      try {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            search: value,
            sortBy,
            page,
          }),
        });
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooksData();
  }, [sortBy, value, page]);

  return (
    <>
      <LibraryHeader />
      {/* Search Bar */}
      <section className="border-2 mt-14 mx-auto h-12 border-white rounded-lg w-[85%] relative">
        <Search className="text-white size-6 top-2 left-1 absolute" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="text-lg border-none mt-1 text-white w-[90%] mx-auto"
        />
      </section>

      {/* Sort Dropdown */}
      <section className="mt-4 text-white relative w-full ">
        <Select  onValueChange={(val) => setSortBy(val)} defaultValue={sortBy}>
          <SelectTrigger className="w-[180px] max-md:w-[100px] absolute right-0">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Oldest">Oldest</SelectItem>
            <SelectItem value="Newest">Newest</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Highest Rated">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* Book List */}
      {books?.length<1 ? <h1 className="font-bebas-neue mt-20 text-5xl font-bold text-center text-light-100">
        no books available
      </h1> :<BookList title="All Library Books" books={books} />}
      

      {/* Pagination Buttons */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-white">Page {page}</span>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          onClick={() => setPage(prev => prev + 1)}
          disabled={books.length < 10} // Disable if less than 10 books are returned
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Page;
