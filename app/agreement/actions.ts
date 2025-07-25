'use server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

export interface Agreement {
  id: string;
  title: string;
  content: string;
  subject: string;
  valid_from: string | null;
  valid_until: string | null;
  status: 'draft' | 'active' | 'expired' | 'cancelled';
}

export interface AgreementResponse {
  id: string;
  status: 'expired' | 'sent' | 'viewed' | 'agreed' | 'disagreed';
  email_sent_to: string;
  sent_at: string;
  viewed_at: string | null;
  responded_at: string | null;
  agreed: boolean | null;
}

export interface AgreementData {
  agreement: Agreement;
  response: AgreementResponse;
  can_respond: boolean;
}

/**
 * Fetch agreement data using the web API with token validation
 * @param responseId - The agreement response ID
 * @param accessToken - The access token for validation
 */
export async function getAgreement(responseId: string, accessToken: string): Promise<AgreementData | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/agreement/${responseId}?token=${accessToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Don't cache sensitive agreement data
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch agreement:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching agreement:', error);
    return null;
  }
}

/**
 * Submit agreement response (agree/disagree)
 * @param responseId - The agreement response ID
 * @param accessToken - The access token for validation
 * @param agreed - Whether the user agreed or disagreed
 * @param notes - Optional response notes
 */
export async function submitAgreementResponse(
  responseId: string,
  accessToken: string,
  agreed: boolean,
  notes?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/agreement/${responseId}/respond`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: accessToken,
          agreed,
          response_notes: notes,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to submit response',
      };
    }

    return {
      success: true,
      message: agreed ? 'Agreement accepted successfully!' : 'Agreement declined successfully!',
    };
  } catch (error) {
    console.error('Error submitting agreement response:', error);
    return {
      success: false,
      message: 'An error occurred while submitting your response',
    };
  }
}
