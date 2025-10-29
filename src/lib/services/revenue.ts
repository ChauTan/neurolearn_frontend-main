// import { getSession } from 'next-auth/react'; // Remove unused import

export async function getMyIncome(): Promise<number> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/revenue/income/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch income');
  }
  const data = await res.json();
  // Return income from the response (API returns {success: true, income: number})
  return data?.income ?? 0;
} 