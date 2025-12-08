const GYMLY_API_URL = 'https://api.gymly.io';
const GYMLY_API_KEY = process.env.GYMLY_API_KEY!;
const GYMLY_BUSINESS_ID = process.env.GYMLY_BUSINESS_ID!;

interface GymlyUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  email: string;
  active: boolean;
  lastCheckinAt: string | null;
  dateOfBirth: string | null;
}

interface GymlyUsersResponse {
  content: GymlyUser[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export async function getAllActiveMembers(): Promise<GymlyUser[]> {
  const allUsers: GymlyUser[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await fetch(
      `${GYMLY_API_URL}/api/v2/businesses/${GYMLY_BUSINESS_ID}/users?page=${page}&size=100&active=true&type=MEMBER`,
      {
        headers: {
          'Authorization': `ApiKey ${GYMLY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gymly API error: ${response.status}`);
    }

    const data: GymlyUsersResponse = await response.json();
    allUsers.push(...data.content);
    totalPages = data.totalPages;
    page++;
  }

  return allUsers;
}

export function getInactiveMembers(users: GymlyUser[], days: number): GymlyUser[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return users.filter(user => {
    if (!user.lastCheckinAt || !user.phoneNumber) return false;
    const lastCheckin = new Date(user.lastCheckinAt);
    return lastCheckin < cutoffDate;
  });
}