import { Loader2 } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';

type LoadingButtonProps = {
  pending: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
} & VariantProps<typeof buttonVariants>;

export default function LoadingButton({
  pending,
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className,
  type = 'submit',
}: LoadingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn('w-full relative', className)}
      type={type}
      variant={variant}
      size={size}
      disabled={pending}
    >
      <div className="flex items-center justify-center gap-2">
        {pending && <Loader2 className="w-4 h-4 animate-spin absolute" />}
        <span className={cn(pending && 'invisible')}>{children}</span>
      </div>
    </Button>
  );
}
