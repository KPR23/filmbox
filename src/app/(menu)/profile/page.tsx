import { headers } from 'next/headers';
import ProfilePage from './profile';
import { auth } from '@/auth/auth';

export default async function ProfilePageWrapper() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <ProfilePage session={session} />;
}
