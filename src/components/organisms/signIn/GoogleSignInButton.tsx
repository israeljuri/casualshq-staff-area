'use client';

import { Button } from '@/components/molecules/Button';
import googleIcon from '@/assets/input/google.svg';

export const GoogleSigninButton = () => {
  const handleGoogleSignIn = async () => {
    // Simulated Google Token (in reality: get this from Google SDK or NextAuth)
    // const googleToken = 'mock-google-oauth-token';
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      leftIcon={<img src={googleIcon} alt="" />}
      onClick={handleGoogleSignIn}
    >
      Sign In with Google
    </Button>
  );
};
