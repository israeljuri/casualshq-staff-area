import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { Button } from '@/components/molecules/Button';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface DashboardHeaderProps {
  userName: string;
  organizationName: string;
  userAvatar: string;
  onSignOut: () => void;
}

export const Header = ({
  userName,
  organizationName,
  userAvatar,
  onSignOut,
}: DashboardHeaderProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleInitiateAction = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    onSignOut();
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        content={
          <article className="p-5 bg-white rounded-2xl border">
            <article className="space-y-3">
              <h4 className="font-medium text-2xl text-black">Log out?</h4>
              <p className="text-base text-custom-gray">
                You&apos;ll need to sign in again to access your account.
              </p>
            </article>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <Button
                variant="outline"
                size="md"
                onClick={handleCancel}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleConfirm}
                className="bg-red-500 text-white w-full hover:bg-red-600 active:bg-red-800"
              >
                Log out
              </Button>
            </div>
          </article>
        }
      />
      <header className="py-2 border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center ">
          <div className="text-2xl font-bold text-blue-600">
            <Image src="/logo.png" alt="CasualsHQ" width={150} height={40} />
          </div>

          <button
            onClick={handleInitiateAction}
            className="cursor-pointer w-auto h-auto flex items-center gap-2 p-5"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>
                {userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-left hidden md:block">
              <div className="text-xs text-gray-500 font-normal inline-flex items-center mt-1 border border-gray-300 bg-gray-100 px-2 py-1 rounded-sm capitalize">
                {organizationName}
              </div>
              <div className="text-sm font-medium text-black capitalize">{userName}</div>
              <div className="text-xs text-custom-gray">Signed in</div>
            </div>
            <LogOut className="h-5 w-5 text-custom-gray ml-2 transform transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </header>
    </>
  );
};
