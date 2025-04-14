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
      
      const response = await fetch(url);
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

  export const fetchPage = async (
    domainName: string = 'jaalyantra.com',
    slug: string
  ): Promise<Page> => {
    try {
      // Fallback to a default API URL if env variable is not available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:9000/web';
      const url = `${apiUrl}/website/${domainName}/${slug}`;
      console.log('Fetching data from:', url);
      
      const response = await fetch(url);
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
    const response = await fetch(url);
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
    
  
  export const getCategories = () => {
    const cats  = [{
        title: 'category1',
        slug: 'category1'
    },

    {
        title: 'category2',
        slug: 'category2'
    }

    ]
    return  cats
    
  }

  export const fetchFooter = (slug: string) => {
    const pageData = fetchPage('jaalyantra.com', slug)
    return pageData
  }
  
