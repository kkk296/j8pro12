import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getFavorites, addFavorite, removeFavorite, isServerless } from '@/lib/auth-store';

export async function GET() {
  try {
    // Use in-memory store for Vercel (serverless)
    if (isServerless()) {
      const favorites = getFavorites();
      return NextResponse.json({ favorites });
    }

    // Use Prisma for local development
    const favorites = await db.favoriteStock.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Fetch favorites error:', error);
    return NextResponse.json({ favorites: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, name } = body;

    if (!symbol || !name) {
      return NextResponse.json({ error: 'Symbol and name required' }, { status: 400 });
    }

    // Use in-memory store for Vercel (serverless)
    if (isServerless()) {
      const success = addFavorite(symbol, name);
      if (!success) {
        return NextResponse.json({ error: 'Already in favorites' }, { status: 400 });
      }
      return NextResponse.json({ success: true, favorite: { symbol, name } });
    }

    // Use Prisma for local development
    const existing = await db.favoriteStock.findUnique({
      where: { symbol }
    });

    if (existing) {
      return NextResponse.json({ error: 'Already in favorites' }, { status: 400 });
    }

    const favorite = await db.favoriteStock.create({
      data: { symbol, name }
    });

    return NextResponse.json({ success: true, favorite });
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    // Use in-memory store for Vercel (serverless)
    if (isServerless()) {
      const success = removeFavorite(symbol);
      if (!success) {
        return NextResponse.json({ error: 'Not found in favorites' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    // Use Prisma for local development
    await db.favoriteStock.delete({
      where: { symbol }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete favorite error:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
