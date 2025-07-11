'use server';

interface GetPersonsParams {
  limit?: number;
  offset?: number;
}

export const getPersons = async (params: GetPersonsParams = {}) => {
  const { limit = 20, offset = 0 } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL! || 'http://localhost:9000';
  const url = new URL(`${apiUrl}/persons`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
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
