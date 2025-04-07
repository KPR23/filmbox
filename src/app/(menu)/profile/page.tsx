import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AvatarComponent from '@/components/avatar';
import { auth } from '@/auth/auth';
import { headers } from 'next/headers';

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full mt-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Zmień swoje dane i ustawienia</CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <AvatarComponent
                size={60}
                src={session?.user.image || ''}
                name={session?.user.name || ''}
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{session?.user.name}</h1>
                <p className="text-sm text-gray-500">{session?.user.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
