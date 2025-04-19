import { useTransition } from "react";
import { toast } from "react-toastify";

import { cacheAuthInfo } from "../utils/auth-utils";
import Auth from "../services/auth-service/types/auth";
import Credentials from "../services/auth-service/types/credentials";
import { AbortableRequestReturnType } from "../services/abortable-request";

const useLogin = (
  callback: (Credentials: Credentials) => AbortableRequestReturnType<Auth>
) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (values: { email: string; password: string }) => {
    startTransition(async () => {
      const { email, password } = values;

      try {
        const tokens = (await callback({ email, password }).request).data;
        cacheAuthInfo(tokens);
      } catch (error) {
        console.error(error);
        const innerError = error as {
          response: { data: { error: string } };
          message: string;
        };
        toast.error(innerError.response.data.error || "Problem has occured");
      }
    });
  };

  return { isPending, handleSubmit };
};

export default useLogin;
