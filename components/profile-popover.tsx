import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SelectProfile } from './select-profile';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogTrigger } from './ui/dialog';

export function ProfileOptions({
  avatarImg,
}: {
  avatarImg: string | undefined | null;
}) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            {avatarImg ? <AvatarImage src={avatarImg} /> : null}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem>Switch Profile</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <SelectProfile />
    </Dialog>
  );
}
