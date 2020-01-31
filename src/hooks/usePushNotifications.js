import {useCallback, useRef} from "react";
import {NotificationManager} from "react-notifications";
import {useDidUpdateEffect} from "./useDidUpdateEffect";

const INTERNET_TIMEOUT = 2000;

export default function usePushNotifications({ isOnline }) {
  const debounced = useRef(false);
  // we need store this value in ref for get it from useCallback
  const isOnlineRef = useRef(isOnline);

  const notifyIfOffline = useCallback(() => {
    debounced.current = false;
    if (!isOnlineRef.current) {
      NotificationManager.info('Offline');
    }
  }, []);

  useDidUpdateEffect(() => {
    isOnlineRef.current = isOnline;

    if (debounced.current) return;

    if (isOnline) return NotificationManager.info('Online');

    debounced.current = true;
    setTimeout(notifyIfOffline, INTERNET_TIMEOUT);
  }, [isOnline]);
}
