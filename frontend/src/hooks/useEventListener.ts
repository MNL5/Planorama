import { useEffect } from "react";

export const useEventListener = (event = "", callback = {}) => {
    useEffect(() => {
        document.addEventListener(event, callback);

        return () => {
            document.removeEventListener(event, callback);
        }
    }, [])
}