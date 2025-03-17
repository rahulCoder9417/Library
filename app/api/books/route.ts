import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { books } from '@/database/schema';
import { eq, like, asc, desc, gt } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Destructure page with a default value of 1 if not provided.
    const { search, sortBy, page = 1 } : { search: string, sortBy: string, page: number } = await request.json();

    let query = db.select().from(books) as any;

    if (search) {
      // Using wildcards for partial matches.
      query = query.where(like(books.title, `%${search}%`));
    }

    if (sortBy === 'Oldest') {
      query = query.orderBy(asc(books.createdAt));
    } else if (sortBy === 'Newest') {
      query = query.orderBy(desc(books.createdAt));
    } else if (sortBy === 'Highest Rated') {
      query = query.orderBy(desc(books.rating));
    } else if (sortBy === 'Available') {
      query = query.where(gt(books.availableCopies, 1));
    }

    // Apply pagination: limit to 10 items per page.
    const limit = 10;
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}
