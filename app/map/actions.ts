'use server';

type FilterValue = string | number | boolean | Record<string, string | number | boolean>;

interface GetPersonsParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, FilterValue>;
}

export const getPersons = async (params: GetPersonsParams = {}) => {
  const { limit = 20, offset = 0, filters = {} } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:9000';
  const url = new URL(`${apiUrl}/persons`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  // Append filters to the query string
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'public_metadata' && typeof value === 'object' && value !== null) {
        // Handle nested public_metadata object, e.g., { public_metadata: { role: 'artisan' } }
        // becomes &public_metadata[role]=artisan
        Object.entries(value).forEach(([metaKey, metaValue]) => {
          if (metaValue !== undefined && metaValue !== null) {
            url.searchParams.set(`public_metadata[${metaKey}]`, String(metaValue));
          }
        });
      } else if (value !== undefined && value !== null) {
        // Handle top-level filters like person_type, first_name, last_name
        url.searchParams.set(key, String(value));
      }
    });
  }
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 10 } });
    if (!res.ok) {
      throw new Error('Failed to fetch persons');
    }
    const data = await res.json();

    return data.persons;
  } catch (error) {
    console.error(error);
    return [];
  }
};
