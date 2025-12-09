const GYMLY_API_URL = 'https://api.gymly.io';

export interface Gym {
  id: string;
  name: string;
  gymly_api_key?: string;
  gymly_business_id?: string;
}

export interface GymlyUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  email: string;
  active: boolean;
  lastCheckinAt: string | null;
  dateOfBirth: string | null;
  gender: string | null;
}

interface GymlyUsersResponse {
  content: GymlyUser[];
  totalPages: number;
  totalElements: number;
  number: number;
}

// Haal alle actieve leden op voor een specifieke gym
export async function getAllActiveMembers(gym: Gym, debug = false): Promise<GymlyUser[]> {
  if (!gym.gymly_api_key || !gym.gymly_business_id) {
    throw new Error(`Gym ${gym.name} has no Gymly credentials configured`);
  }

  const allUsers: GymlyUser[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await fetch(
      `${GYMLY_API_URL}/api/v2/businesses/${gym.gymly_business_id}/users?page=${page}&size=100&active=true&type=MEMBER`,
      {
        headers: {
          'Authorization': `ApiKey ${gym.gymly_api_key}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gymly API error: ${response.status}`);
    }

    const data: GymlyUsersResponse = await response.json();
    
    if (debug && page === 1 && data.content.length > 0) {
      console.log(`🔍 [${gym.name}] RAW API keys:`, Object.keys(data.content[0]));
      console.log(`🔍 [${gym.name}] First user:`, JSON.stringify(data.content[0], null, 2));
    }

    allUsers.push(...data.content);
    totalPages = data.totalPages;
    page++;
  }

  console.log(`📊 [${gym.name}] Fetched ${allUsers.length} active members`);
  return allUsers;
}

// Haal details van 1 specifieke user op
export async function getUserDetails(gym: Gym, userId: string): Promise<GymlyUser> {
  if (!gym.gymly_api_key || !gym.gymly_business_id) {
    throw new Error(`Gym ${gym.name} has no Gymly credentials configured`);
  }

  const response = await fetch(
    `${GYMLY_API_URL}/api/v2/businesses/${gym.gymly_business_id}/users/${userId}`,
    {
      headers: {
        'Authorization': `ApiKey ${gym.gymly_api_key}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Gymly API error: ${response.status}`);
  }

  return response.json();
}

// Filter inactieve leden (30+ of 60+ dagen niet geweest)
export function getInactiveMembers(users: GymlyUser[], days: number): GymlyUser[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return users.filter(user => {
    if (!user.lastCheckinAt || !user.phoneNumber) return false;
    const lastCheckin = new Date(user.lastCheckinAt);
    return lastCheckin < cutoffDate;
  });
}

// Filter leden met verjaardag vandaag
export function getBirthdayMembers(users: GymlyUser[]): GymlyUser[] {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  return users.filter(user => {
    if (!user.dateOfBirth || !user.phoneNumber) return false;
    const dob = new Date(user.dateOfBirth);
    return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay;
  });
}