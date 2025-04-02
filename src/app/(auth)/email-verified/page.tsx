import TimeRedirection from '@/components/timeRedirection';
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card';

export default async function EmailVerifiedPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center justify-center">
              <CardTitle className="text-2xl">
                E-mail zweryfikowany 📨
              </CardTitle>
              <CardDescription>
                Twoje konto zostało pomyślnie zweryfikowane.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TimeRedirection redirectTo="/movies" seconds={5} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
