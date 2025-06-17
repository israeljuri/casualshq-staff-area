import { useMutation } from "@tanstack/react-query";
import { authCookies } from "@/lib/authCookies";
import { useRouter } from "next/navigation";
import { staffLogout } from "@/services/authentication.service";
import useAlert from "./useAlert";

export const useStaffLogout = () => {
  const router = useRouter();
  const alert = useAlert()

  return useMutation({
    mutationFn: () => staffLogout(),
    onSuccess: () => {
      authCookies.clear();
      router.replace('/sign-in');
    },
    onError: (error) => {
      console.error('Staff Sign Out failed:', error);
      alert.showAlert(error.name, 'error', {
        subtext: error.message,
      });
    },
  });
};