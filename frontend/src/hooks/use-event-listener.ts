import { useEffect } from "react";

export const useEventListener = (
  event: string,
  callback: (event: CustomEvent) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      callback(event as CustomEvent);
    };
    document.addEventListener(event, listener);

    return () => {
      document.removeEventListener(event, listener);
    };
  }, [event, callback]);
};
