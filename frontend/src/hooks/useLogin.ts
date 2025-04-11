import { useTransition } from "react";
import { cacheAuthInfo } from "../utils/AuthUtil";
import Credentials from "../services/Auth/types/Credentials";
import { abortablePostRequestReturnType } from "../services/AbortableRequest";
import Auth from "../services/Auth/types/Auth";
import { toast } from "react-toastify";

const useLogin = (callback: (Credentials: Credentials) => abortablePostRequestReturnType<Auth>) => {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (values) => {
        startTransition(async () => {
            const { email, password } = values;       

            try {
                const tokens = (
                  await callback({ email, password }).request
                ).data;
                cacheAuthInfo(tokens);
            } catch (error) {
                console.error(error);
                const innerError = error as {
                  response: { data: {error: string} };
                  message: string;
                };
                toast.error(innerError.response.data.error || "Problem has occured");
            }
        })
    };

    return {isPending, handleSubmit}
}

export default useLogin;