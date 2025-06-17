'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { Button } from '@/components/molecules/Button';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
 
import useAlert from '@/hooks/useAlert';
import { useRouter } from 'next/navigation';
import { GET_BUSINESS, GET_USER } from '@/graphql/queries';
import { getCookie } from 'cookies-next';
import { LOGOUT } from '@/graphql/mutations';

export const Header = () => {
  const router = useRouter();
  const alert = useAlert();
  const [user, setUser] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string;
    business: {
      business_name: string;
    };
  } | null>({
    first_name: 'Anonymous',
    last_name: 'User',
    email: 'anonymous@user.com',
    avatar_url: '',
    business: {
      business_name: 'CasualsHQ',
    },
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // User Query
  const [getUser] = useLazyQuery(GET_USER, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: (data) => {
      setUser({
        first_name:
          data.staffMember.staff_information.personal_information.first_name,
        last_name:
          data.staffMember.staff_information.personal_information.last_name,
        email: data.staffMember.staff_information.personal_information.email,
        avatar_url: data.staffMember.staff_information.avatar_url,
        business: {
          business_name: user?.business.business_name || 'CasualsHQ',
        },
      });
    },
  });

  // Business Query
  const [getBusiness] = useLazyQuery(GET_BUSINESS, {
    fetchPolicy: 'cache-only',
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: (data) => {
      setUser({
        ...user,
        business: {
          business_name: data.business.business_name,
        },
      } as {
        first_name: string;
        last_name: string;
        email: string;
        avatar_url: string;
        business: {
          business_name: string;
        };
      });
    },
  });

  // Logout Mutation
  const [logout] = useMutation(LOGOUT, {
    onError: (error) => {
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
    onCompleted: () => {
      setUser(null);
      router.replace('/sign-in');
    },
  });

  const handleInitiateAction = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    logout();
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  // Fetch user with user id from cookies
  useEffect(() => {
    const userId = getCookie('user_id');
    if (userId) {
      getUser({ variables: { staffMemberId: userId } });
    }
  }, []);

  // Fetch business
  useEffect(() => {
    getBusiness();
  }, []);

  return (
    <>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        content={
          <article className="p-5 bg-white w-auto md:max-w-[19.75rem] rounded-[1rem] border">
            <article className="space-y-3">
              <h4 className="font-medium text-[1.5rem] text-black">Log out?</h4>
              <p className="text-[0.875rem] text-custom-gray max-w-[30ch]">
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
          <figure className="text-2xl font-bold text-blue-600 w-[8.292rem] h-[1.75rem]">
            <Image src="/logo.svg" alt="CasualsHQ" width={400} height={400} />
          </figure>

          <button
            onClick={handleInitiateAction}
            className="cursor-pointer w-auto h-auto flex items-center gap-2 p-5"
          >
            <Avatar className="h-10 w-10">
              {user && user?.avatar_url && (
                <AvatarImage src={user?.avatar_url} alt={user?.first_name} />
              )}
              <AvatarFallback>
                {user &&
                  `${user?.first_name} ${user?.last_name}`
                    .split(' ')
                    .map((word) => word[0].toUpperCase())
                    .join('')}
              </AvatarFallback>
            </Avatar>

            <div className="text-left hidden md:block">
              <div className="text-[0.625rem] text-gray-500 font-normal inline-flex items-center mt-1 border border-gray-300 bg-gray-100 px-[0.25rem] py-[0.125rem] rounded-[0.25rem] capitalize">
                {user?.business.business_name}
              </div>
              <div className="text-[0.875rem] font-medium text-black capitalize">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-[0.875rem] text-custom-gray">Signed in</div>
            </div>
            <LogOut className="h-5 w-5 text-custom-gray ml-2 transform transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </header>
    </>
  );
};
