'use client';

import LoadingButton from './loading-button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useRouter } from 'next/navigation';

export default function Alert(params: {
  title: string;
  icon?: React.ReactNode;
  message: string;
  redirectTo?: string;
  redirectText?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-2">
          <CardHeader className="text-center justify-center">
            <CardTitle className="text-2xl flex items-center gap-2">
              {params.title} {params.icon}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                {params.message}
              </p>
              {params.redirectTo && (
                <div className="flex justify-center pt-2">
                  <LoadingButton
                    onClick={() => router.push(params.redirectTo || '/')}
                    className="w-full"
                  >
                    {params.redirectText}
                  </LoadingButton>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
