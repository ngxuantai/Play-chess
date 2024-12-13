import { useEffect } from "react";
import socketService from "@/api/socket.service";

export function useSocketEvent(
  event: string,
  callback: (...args: any[]) => void
) {
  useEffect(() => {
    socketService.on(event, callback);

    return () => {
      socketService.off(event, () => {});
    };
  }, [event, callback]);
}
