import { eq, count, gte, lt, and, lte, isNull } from 'drizzle-orm';
import { subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { db } from '@/database/drizzle';
import { books, borrowRecords, users } from '@/database/schema';
import { BorrowedBook } from '@/components/admin/AdminSection';

type PropType = 'book' | 'borrowedBook' | 'user';

export async function getAdminData(prop: PropType) {
  let table;
  switch (prop) {
    case 'book':
      table = books;
      break;
    case 'borrowedBook':
      table = borrowRecords;
      break;
    case 'user':
      table = users;
      break;
    default:
      return {
        total: 0,
        change: 0
      };
  }

  const startOfThisWeek = startOfWeek(new Date());
  const endOfThisWeek = endOfWeek(new Date());

  const startOfLastWeek = startOfWeek(subWeeks(new Date(), 1));
  const endOfLastWeek = endOfWeek(subWeeks(new Date(), 1));


  const totalThisWeekResult = await db
  .select({ count: count() })
  .from(table)
  .where(
    and(
      gte(table.createdAt, startOfThisWeek), // Start of this week (inclusive)
      lte(table.createdAt, endOfThisWeek)    // End of this week (inclusive)
    )
  )
  .execute();

  const totalThisWeek = totalThisWeekResult[0]?.count ?? 0;


  const totalLastWeekResult = await db
    .select({ count: count() })
    .from(table)
    .where(
      and(gte(table.createdAt, startOfLastWeek), lt(table.createdAt, endOfLastWeek))
    )
    .execute();

  const totalLastWeek = totalLastWeekResult[0]?.count ?? 0;
        
  // Calculate the change (increase or decrease)
  const change = totalThisWeek - totalLastWeek;
  const totalRecordsResult = await db
  .select({ count: count() })
  .from(table)
  .execute();

const totalRecords = totalRecordsResult[0]?.count ?? 0;

  return {
    total: totalRecords,
    change: change
  };
}


export const getActiveBorrowRecords = async(): Promise<BorrowedBook[] | null>  => {
  try {
    const records = await db
      .select({
        borrow_date: borrowRecords.borrowDate,
        user_id: borrowRecords.userId,
        book_id: borrowRecords.bookId,
      })
      .from(borrowRecords)
      .where(isNull(borrowRecords.returnDate)) // ✅ Filter where return_date is NULL
      .execute();

    if (!records || records.length === 0) {
      return [];
    }
    const enrichedRecords = await Promise.all(
      records.map(async (record) => {
        const user = await db
          .select({
            fullname: users.fullName,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, record.user_id))
          .execute()
          .then((res) => res[0]);

        const book = await db
          .select({
            cover_image: books.coverUrl,
            title: books.title,
            genre: books.genre,
            author: books.author,
          })
          .from(books)
          .where(eq(books.id, record.book_id))
          .execute()
          .then((res) => res[0]); // Get the first result

        return {
          borrow_date: record.borrow_date,
          user: user ? { fullname: user.fullname, email: user.email } : null,
          book: book
            ? {
                cover_image: book.cover_image,
                title: book.title,
                genre: book.genre,
                author: book.author,
              }
            : null,
        };
      })
    );

    return enrichedRecords;
  } catch (error) {
    console.error("Failed to get active borrow records:", error);
    return [];
  }
};

export const getLatestBooks = async (): Promise<Book[]> => {
  try {
    const latestBooks = await db
      .select()
      .from(books)
      .orderBy(books.createdAt) // Assuming `createdAt` exists
      .limit(8);
    
    return latestBooks;
  } catch (error) {
    console.error("Failed to fetch latest books:", error);
    throw new Error("Could not fetch latest books");
  }
};

export const getUsers = async (): Promise<{ fullName: string; email: string }[]> => {
  try {
    const getUsers = await db
      .select({ fullName: users.fullName, email: users.email })
      .from(users)
      .orderBy(users.createdAt)
      .where(eq(users.status,"PENDING"))
      .limit(6);
    
    return getUsers; // Return the whole array, not just the first user
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw new Error("Failed to fetch users");
  }
}
