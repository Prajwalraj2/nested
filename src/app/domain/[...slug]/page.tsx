// app/domain/[...slug]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SubcategorySelector } from '@/components/domain/SubcategorySelector';
import { SectionBasedLayout } from '@/components/domain/SectionBasedLayout';
import { NarrativeLayout } from '@/components/domain/NarrativeLayout';
import { TableLayout } from '@/components/domain/TableLayout';
import { RichTextLayout } from '@/components/domain/RichTextLayout';

type Props = { params: Promise<{ slug: string[] }> };

// Types for better type safety
type DomainWithPages = {
  id: string;
  name: string;
  slug: string;
  pageType: string;
  pages: PageWithContent[];
};

type PageWithContent = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  sections?: any;  // JSON field for section configuration
  content: any[];
  subPages: any[];
  richTextContent?: {
    id: string;
    htmlContent: string;
    title: string | null;
    wordCount: number;
    updatedAt: Date;
  } | null;
};

// Helper function to find page by nested slug path
async function findPageByPath(domainId: string, slugPath: string[], domain: DomainWithPages): Promise<PageWithContent | null> {
  if (slugPath.length === 0) return null;
  
  let currentPage: PageWithContent | null = null;

  // For direct domains, first look in __main__ page children
  if (domain.pageType === 'direct') {
    const mainPage = await prisma.page.findFirst({
      where: { 
        domainId: domainId, 
        slug: '__main__'
      }
    });

    if (mainPage) {
      // Look for the first slug as a child of __main__
      currentPage = await prisma.page.findFirst({
        where: {
          slug: slugPath[0], 
          domainId: domainId, 
          parentId: mainPage.id // Child of __main__ page
        },
        select: {
          id: true,
          title: true,
          slug: true,
          contentType: true,
          sections: true,  // Include sections configuration
          content: {
            select: { id: true, type: true, content: true, order: true },
            orderBy: { order: 'asc' }
          },
          subPages: {
            select: { id: true, title: true, slug: true },
            orderBy: { order: 'asc' }
          },
          richTextContent: {
            select: {
              id: true,
              htmlContent: true,
              title: true,
              wordCount: true,
              updatedAt: true
            }
          }
        }
      });
    }
  } else {
    // For hierarchical domains, look for root level pages  
    currentPage = await prisma.page.findFirst({
    where: {
        slug: slugPath[0], 
        domainId: domainId, 
        parentId: null 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        contentType: true,
        sections: true,  // Include sections configuration
        content: {
          select: { id: true, type: true, content: true, order: true },
          orderBy: { order: 'asc' }
        },
        subPages: {
          select: { id: true, title: true, slug: true },
          orderBy: { order: 'asc' }
        },
        richTextContent: {
          select: {
            id: true,
            htmlContent: true,
            title: true,
            wordCount: true,
            updatedAt: true
          }
        }
      }
    });
  }

  // Traverse nested path for remaining slugs
  for (let i = 1; i < slugPath.length && currentPage; i++) {
    currentPage = await prisma.page.findFirst({
      where: {
        slug: slugPath[i], 
        domainId: domainId, 
        parentId: currentPage.id 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        contentType: true,
        sections: true,  // Include sections configuration
        content: {
          select: { id: true, type: true, content: true, order: true },
          orderBy: { order: 'asc' }
        },
        subPages: {
          select: { id: true, title: true, slug: true },
          orderBy: { order: 'asc' }
        },
        richTextContent: {
          select: {
            id: true,
            htmlContent: true,
            title: true,
            wordCount: true,
            updatedAt: true
          }
        }
      }
    });
  }

  return currentPage as PageWithContent | null;
}

// NEW: Helper function to get or create main page for direct domains
async function getOrCreateMainPage(domain: DomainWithPages): Promise<PageWithContent> {
  // For direct domains, we need a main page to store ContentBlocks
  let mainPage = await prisma.page.findFirst({
    where: { 
      domainId: domain.id, 
      slug: '__main__'  // Hidden main page identifier
    },
    select: {
      id: true,
      title: true,
      slug: true,
      contentType: true,
      sections: true,  // Include sections configuration
      content: {
        select: { id: true, type: true, content: true, order: true },
        orderBy: { order: 'asc' }
      },
      subPages: {
        select: { id: true, title: true, slug: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!mainPage) {
    // Create the main page if it doesn't exist
    mainPage = await prisma.page.create({
      data: {
        title: domain.name,
        slug: '__main__',
        contentType: 'section_based',
        domainId: domain.id,
        order: 0,
        sections: undefined  // Start with no sections - will be configured later
      },
      select: {
        id: true,
        title: true,
        slug: true,
        contentType: true,
        sections: true,
        content: {
          select: { id: true, type: true, content: true, order: true },
          orderBy: { order: 'asc' }
        },
        subPages: {
          select: { id: true, title: true, slug: true },
          orderBy: { order: 'asc' }
        },
        richTextContent: {
          select: {
            id: true,
            htmlContent: true,
            title: true,
            wordCount: true,
            updatedAt: true
          }
        }
      }
    });
  }

  return mainPage as PageWithContent;
}

// Main page handler with hybrid flow logic
export default async function DomainPage({ params }: Props) {
  const awaitedParams = await params;
  const [domainSlug, ...restSlug] = awaitedParams.slug;

//   console.log(domainSlug, restSlug);  // webdev [] | gdesign [] | appdev ['android'] | appdev ['ios'] | appdev ['cross-platform']

  // Find domain with its top-level pages
  const domain = await prisma.domain.findUnique({
    where: { slug: domainSlug },
    include: {
      pages: {
        where: { parentId: null },
        include: {
          content: { orderBy: { order: 'asc' } },
          subPages: { orderBy: { order: 'asc' } }
        },
        orderBy: { order: 'asc' }
      }
    }
  }) as DomainWithPages | null;

//   console.log("domain", domain);

  // Output on visiting /domain/gdesign
    /*
            domain {
            id: 'cf28e597-0d85-440e-869c-243d1cf35286',
            name: '🖌️ Graphic Designing',
            slug: 'gdesign',
            pageType: 'direct',
            categoryId: '09cf15c2-974e-4690-a801-66cae0f85484',
            orderInCategory: 0,
            isPublished: true,
            createdAt: 2025-08-29T19:22:28.398Z,
            pages: []
            }
    */

  // Output on visiting /domain/webdev
  /*
        domain {
        id: '40383f19-4c6b-4a5b-9836-329c93537032',
        name: '🌐 Web Development',
        slug: 'webdev',
        pageType: 'hierarchical',
        categoryId: '202f456c-387c-4660-9d10-acf1e5f0b41f',
        orderInCategory: 0,
        isPublished: true,
        createdAt: 2025-08-29T19:22:28.439Z,
        pages: [
            {
            id: 'cf291ab4-430a-4cb1-85c1-1a702ff79355',
            title: 'With Code Web Dev',
            slug: 'with-code',
            contentType: 'section_based',
            domainId: '40383f19-4c6b-4a5b-9836-329c93537032',
            parentId: null,
            order: 1,
            createdAt: 2025-08-30T06:01:49.798Z,
            content: [],
            subPages: []
            },
            {
            id: '0908e39d-5362-4cdd-a40c-15b9a126c1d0',
            title: 'No-Code Web Dev',
            slug: 'no-code',
            contentType: 'section_based',
            domainId: '40383f19-4c6b-4a5b-9836-329c93537032',
            parentId: null,
            order: 2,
            createdAt: 2025-08-30T06:01:49.835Z,
            content: [],
            subPages: []
            }
        ]
        }
  */

  if (!domain) return notFound();

  // This logic checks if the user is accessing the top-level domain route (e.g., /domain/gdesign).
  // It is needed to determine whether to show the main section-based layout directly (for "direct" domains)
  // or to present a subcategory selection screen (for "hierarchical" domains).
  // This checks if the user is visiting the top-level domain route (e.g., /domain/gdesign) with no additional path segments after the domain slug.

  if (restSlug.length === 0) {      //Only true when user visit /domain/gdesign or /domain/webdev without any additional path segments after the domain slug.
    // Direct domain access: /domain/gdesign or /domain/webdev
    
    if (domain.pageType === 'direct') {
      // NEW: Direct domains get or create main page with sections
      const mainPage = await getOrCreateMainPage(domain);
      
      // Fetch child pages for section organization
      const childPages = await prisma.page.findMany({
        where: { 
          domainId: domain.id,
          parentId: mainPage.id  // Children of __main__ page
        },
        select: {
          id: true,
          title: true,
          slug: true,
          contentType: true,
          parentId: true
        },
        orderBy: { order: 'asc' }
      });
      
      return <SectionBasedLayout domain={domain} page={mainPage} childPages={childPages} currentPath={`/domain/${domain.slug}`} />;
    } else {
      // Hierarchical domains: Show subcategory selection
      return <SubcategorySelector domain={domain} />;
    }
  } else {
    // Nested access: /domain/webdev/with-code or /domain/gdesign/youtube-channel
    const page = await findPageByPath(domain.id, restSlug, domain);
    
    if (!page) return notFound();

    // console.log("page in nested access", page);

    // Output on visiting /domain/webdev/with-code
    /*
    page in nested access {
        id: 'cf291ab4-430a-4cb1-85c1-1a702ff79355',
        title: 'With Code Web Dev',
        slug: 'with-code',
        contentType: 'section_based',
        domainId: '40383f19-4c6b-4a5b-9836-329c93537032',
        parentId: null,
        order: 1,
        createdAt: 2025-08-30T06:01:49.798Z,
        content: [],
        subPages: []
        }
    */
    
    // Render based on page contentType
    if (page.contentType === 'section_based') {
      // Fetch child pages for section organization
      const childPages = await prisma.page.findMany({
        where: { 
          domainId: domain.id,
          parentId: page.id  // Children of this section-based page
        },
        select: {
          id: true,
          title: true,
          slug: true,
          contentType: true,
          parentId: true
        },
        orderBy: { order: 'asc' }
      });
      
      return <SectionBasedLayout page={page} domain={domain} childPages={childPages} currentPath={`/domain/${domain.slug}/${restSlug.join('/')}`} />;
    } else if (page.contentType === 'subcategory_list') {
      return <SubcategorySelector domain={domain} page={page} />;
    } else if (page.contentType === 'table') {

      // console.log("page in nested access for table", page);
      // console.log("domain in nested access for table", domain);
      // On visiting : http://localhost:3000/domain/gdesign/ytube
      // Output:
      /*
        page in nested access for table {
          id: '88a9bf4d-0897-42ba-9c29-16b56e5cca73',
          title: '▶️ YouTube Channel',
          slug: 'ytube',
          contentType: 'table',
          sections: null,
          content: [],
          subPages: [],
          richTextContent: null
        }
      */
      /*
        domain in nested access for table {
          id: 'd9a88a1e-39fe-47e1-bcf2-5e13f4647055',
          name: '🖌️ Graphic Designing',
          slug: 'gdesign',
          pageType: 'direct',
          categoryId: '70d70dae-f839-4fb0-bec2-423707bfa253',
          orderInCategory: 0,
          isPublished: true,
          createdAt: 2025-09-12T05:20:50.985Z,
          pages: [
            {
              id: 'ecab70c3-0260-45af-b7bc-f1c5ce18905a',
              title: '☘️ Graphic Designing',
              slug: '__main__',
              contentType: 'section_based',
              sections: [Array],
              domainId: 'd9a88a1e-39fe-47e1-bcf2-5e13f4647055',
              parentId: null,
              order: 0,
              createdAt: 2025-09-12T05:20:53.903Z,
              content: [],
              subPages: [Array]
            }
          ]
        }
      */

      return <TableLayout page={page} domain={domain} />;
    } else if (page.contentType === 'rich_text') {
      return <RichTextLayout page={page} domain={domain} />;
    } else {
      // Default narrative layout
      return <NarrativeLayout page={page} domain={domain} />;
    }
  }
}

