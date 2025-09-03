// src/app/api/domain/tables/by-page/[pageId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API Route for Frontend Table Data Fetching
 * 
 * GET /api/domain/tables/by-page/[pageId] - Get table data for a specific page
 * 
 * This endpoint is used by the frontend TableLayout component to fetch
 * table data for display on domain pages.
 * 
 * Features:
 * - Retrieves table data by page ID
 * - Returns formatted data for frontend consumption
 * - Handles cases where no table exists for the page
 * - Optimized for public display (no sensitive admin data)
 */

/**
 * GET /api/domain/tables/by-page/[pageId]
 * Retrieve table data for a specific page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const awaitedParams = await params;
    const pageId = awaitedParams.pageId;

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    // Find table associated with this page
    const table = await prisma.table.findUnique({
      where: { pageId: pageId },
      select: {
        id: true,
        name: true,
        schema: true,
        data: true,
        settings: true,
        updatedAt: true,
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
            contentType: true,
            domain: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            }
          }
        }
      }
    });

    if (!table) {
      return NextResponse.json(
        { error: 'No table found for this page' },
        { status: 404 }
      );
    }

    // Return table data formatted for frontend
    return NextResponse.json({
      table: {
        id: table.id,
        name: table.name,
        schema: table.schema,
        data: table.data,
        settings: table.settings,
        updatedAt: table.updatedAt,
        page: table.page
      }
    });

  } catch (error) {
    console.error('Error fetching table data for page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
