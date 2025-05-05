import { useQuery } from "@tanstack/react-query";

interface ApiData {
  domain: string;
  name: string;
  pages: [
    {
      content: string;
      page_type: string;
      slug: string;
      published_at: string;
      status: string;
      title: string;
    },
  ];
  // Add other fields as necessary
}

const fetchApiData = async (domainName: string): Promise<ApiData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const response = await fetch(`${apiUrl}/website/${domainName}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useDomain = (domainName: string) => {
  return useQuery<ApiData>({
    queryKey: ["apiData", domainName],
    queryFn: () => fetchApiData(domainName),
  });
};



// Define the Block interface based on your JSON structure
export interface Block {
    id: string;
    name: string;
    type: string;
    content: Record<string, unknown> | Record<string, string>;
    order: number;
  }
  
  // Define the Page interface
  export interface Page {
    title: string;
    slug: string;
    content: string;
    status: string;
    page_type: string;
    publishedAt: string;
    blocks: Block[];
    metadata: Record<string, unknown>
  }
  
  // Function to fetch page data from the API
  // Define the type for import.meta.env
  // Have to define the jaalyantra as env
  const fetchPageData = async (
    domainName: string = 'jaalyantra.com',
    slug: string
  ): Promise<Page> => {
    try {
      // Fallback to a default API URL if env variable is not available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:9000/web';
      const url = `${apiUrl}/website/${domainName}/blogs/${slug}`;
      console.log('Fetching data from:', url);
      
      // Use Next.js cache with revalidation
      const response = await fetch(url, {
        // Cache the response for 1 hour (3600 seconds)
        next: { revalidate: 3600, tags: [`blog-${slug}`] }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error(`Failed to fetch page data for ${slug}. Status: ${response.status}`);
        throw new Error(`Failed to fetch page data for ${slug}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching page data:', error);
      throw error;
    }
  };

  export const fetchPage = async (
    domainName: string = 'jaalyantra.com',
    slug: string
  ): Promise<Page> => {
    try {
      // Fallback to a default API URL if env variable is not available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:9000/web';
      const url = `${apiUrl}/website/${domainName}/${slug}`;
      console.log('Fetching data from:', url);
      
      // Use Next.js cache with revalidation
      const response = await fetch(url, {
        // Cache the response for 1 hour (3600 seconds)
        next: { revalidate: 3600, tags: [`page-${slug}`] }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error(`Failed to fetch page data for ${slug}. Status: ${response.status}`);
        throw new Error(`Failed to fetch page data for ${slug}`);
      }
  
      const data = await response.json();
      console.log('Fetched data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching page data:', error);
      throw error;
    }
  };
  
  // The main hook
  export const usePageData = (domainName: string, slug: string) => {
    return useQuery<Page>({
      queryKey: ["pageData", domainName, slug],
      queryFn: () => fetchPage(domainName, slug),
    });
  };
  
  // Helper function to get blocks of a specific type
  export const getBlocksByType = (blocks: Block[] | undefined, type: string): Block[] => {
    if (!blocks) return [];
    return blocks.filter(block => block.type === type);
  };
  
  // Helper function to get a single block of a specific type
  export const getBlockByType = (blocks: Block[] | undefined, type: string): Block | undefined => {
    if (!blocks) return undefined;
    return blocks.find(block => block.type === type);
  };

  export const getBlockByName = (blocks: Block[] | undefined, name: string): Block | undefined => {
    if (!blocks) return undefined;
    return blocks.find(block => block.name === name);
  };


  export const useBlogs = (domainName: string, filter: string) => {
    return useQuery<Page[]>({
      queryKey: ["blogs", domainName, filter],
      queryFn: () => fetchBlogs(domainName, filter),
    });
  }
  
  const fetchBlogs = async (domainName: string, filter: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:9000/web';
    const url = `${apiUrl}/website/${domainName}/blogs?${filter}`;
    
    // Use Next.js cache with revalidation
    const response = await fetch(url, {
      // Cache the response for 30 minutes (1800 seconds) since blog lists change more frequently
      next: { revalidate: 1800, tags: ['blogs'] }
    });
   
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs for ${domainName}. Status: ${response.status}`);
    }
    return response.json();
  }

  export const getAllBlogs = (domainName: string, filter: string) => {
    return fetchBlogs(domainName, filter)
  }

  export const getAPost = (slug: string) => {
    return fetchPageData('jaalyantra.com', slug)
  }
    
  
  export const getCategories = async (
    domainName: string = 'jaalyantra.com'
  ): Promise<{ title: string; slug: string }[]> => {
    // Fetch all blogs and derive unique categories from metadata
    const blogs = (await fetchBlogs(domainName, '')) as Array<{
      metadata?: { category?: string }
    }>;
    const categorySet = new Set<string>();
    blogs.forEach((blog) => {
      const meta = blog.metadata;
      if (meta && typeof meta.category === 'string') {
        categorySet.add(meta.category);
      }
    });
    return Array.from(categorySet).map((category) => ({
      title: category,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
    }));
  };

  export const fetchFooter = async (slug: string) => {
    try {
      // Fallback to a default API URL if env variable is not available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:9000/web';
      const url = `${apiUrl}/website/jaalyantra.com/${slug}`;
      
      // Use Next.js cache with longer revalidation time for footer (rarely changes)
      const response = await fetch(url, {
        // Cache the response for 24 hours (86400 seconds) since footer rarely changes
        next: { revalidate: 86400, tags: ['footer'] }
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch footer data. Status: ${response.status}`);
        throw new Error(`Failed to fetch footer data`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching footer data:', error);
      throw error;
    }
  }
  
