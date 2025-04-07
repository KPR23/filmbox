import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function AvatarComponent({
  src,
  name,
  size = 24,
}: {
  src: string;
  name: string;
  size?: number;
}) {
  return (
    <Avatar style={{ width: size, height: size }}>
      <AvatarImage src={src || undefined} />
      <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
