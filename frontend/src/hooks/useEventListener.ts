import { useEffect } from "react";

export const useEventListener = (event: string, callback: (evet: CustomEvent) => void) => {
    useEffect(() => {
        document.addEventListener(event, callback);

        return () => {
            document.removeEventListener(event, callback);
        }
    }, [])
}