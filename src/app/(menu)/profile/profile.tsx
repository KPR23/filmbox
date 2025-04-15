'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AvatarComponent from '@/components/avatar';
import { Ban, Save, UserRoundPen } from 'lucide-react';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Session } from '@/auth/auth';
import { Input } from '@/components/ui/input';
import { getUserData } from '@/lib/queries';
import { User } from '@prisma/client';

interface ProfilePageProps {
  session: Session | null;
}

export default function ProfilePage({ session }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (session?.user?.id) {
        try {
          const data = await getUserData(session.user.id);
          if (data) {
            setUserData(data as User);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    }
    fetchUser();
  }, [session?.user?.id]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full mt-16">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <CardTitle>Profil</CardTitle>
            <CardDescription>Zmień swoje dane i ustawienia</CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <UserRoundPen className="w-6 h-6" />
              Edytuj
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <Ban className="w-6 h-6" />
                Anuluj
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-6 h-6" />
                Zapisz
              </Button>
            </div>
          )}
        </CardHeader>
        <DropdownMenuSeparator className="mx-2" />
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center">
              <AvatarComponent
                size={50}
                src={userData?.image || ''}
                name={userData?.name || ''}
              />
              <div className="flex flex-col w-full max-w-2xs">
                {!isEditing ? (
                  <>
                    <h1 className="text-xl font-bold">{session?.user.name}</h1>
                    <p className="text-sm text-gray-500">{userData?.email}</p>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <Input type="text" value={userData?.name || ''} />
                    <Input type="email" value={userData?.email || ''} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
