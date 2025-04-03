import { Loader2 } from 'lucide-react';
import { LoadingButtonProps } from '@/lib/types';
import { Button } from './ui/button';

export default function LoadingButton({
  isLoading,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button className={className} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}
