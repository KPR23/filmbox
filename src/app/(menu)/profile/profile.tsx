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
import { useState } from 'react';
import { Session } from '@/auth/auth';

interface ProfilePageProps {
  session: Session | null;
}

export default function ProfilePage({ session }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);

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
                src={session?.user.image || ''}
                name={session?.user.name || ''}
              />
              <div className="flex flex-col w-full max-w-2xs">
                {/* {!isEditing ? (
                  <>
                    <h1 className="text-xl font-bold">{session?.user.name}</h1>
                    <p className="text-sm text-gray-500">
                      {session?.user.email}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <Input
                      type="text"
                      value={session?.user.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      type="email"
                      value={session?.user.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
