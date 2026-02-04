// src/app/api/domain/tables/by-page/[pageId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserCountryFromRequest } from '@/lib/server-country';
import { filterRowsByCountry, getPublicSchema, getPublicRows } from '@/lib/table-utils';
import type { TableData, TableSchema } from '@/types/table';

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
 * - **FILTERS ROWS BY USER'S COUNTRY** (geo-targeting)
 * - Hides targetCountries column from public view
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

    // Get user's country from cookie
    const userCountry = getUserCountryFromRequest(request);

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

    // Get schema and data
    const schema = table.schema as TableSchema;
    const data = table.data as TableData;

    // FILTER ROWS BY USER'S COUNTRY
    const filteredRows = filterRowsByCountry(data.rows || [], userCountry);

    // Remove targetCountries column from public view
    const publicSchema = getPublicSchema(schema);
    const publicRows = getPublicRows(filteredRows);

    // Return table data formatted for frontend (filtered by country)
    return NextResponse.json({
      table: {
        id: table.id,
        name: table.name,
        schema: publicSchema,
        data: {
          rows: publicRows,
          metadata: {
            ...data.metadata,
            totalRows: publicRows.length,
            // Include original count for reference (optional)
            unfilteredTotalRows: data.rows?.length || 0,
          }
        },
        settings: table.settings,
        updatedAt: table.updatedAt,
        page: table.page
      },
      // Include filtering info for debugging/transparency
      filtering: {
        userCountry,
        originalRowCount: data.rows?.length || 0,
        filteredRowCount: publicRows.length,
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
