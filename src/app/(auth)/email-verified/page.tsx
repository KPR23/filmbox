import Alert from '@/components/alert';

export default async function EmailVerifiedPage() {
  return (
    <Alert
      title="E-mail zweryfikowany 📨"
      message="Twoje konto zostało pomyślnie zweryfikowane."
      redirectTo="/movies"
      redirectText="Zaloguj się"
    />
  );
}
