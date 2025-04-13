import { useEffect } from "react";
import { QueryKeys } from "@/lib/react-query/queryKeys";
import { subscribeToMessages } from "@/lib/appwrite/config";
import { queryClient } from "@/main";

export const useRealtimeMessages = (chatId: string) => {
  useEffect(() => {
    if (!chatId) return;

    const websocket = subscribeToMessages(chatId, (newMessage) => {
      queryClient.setQueryData(
        [QueryKeys.Messages + chatId],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: [
              [newMessage, ...oldData.pages[0]],
              ...oldData.pages.slice(1),
            ],
          };
        },
      );
    });

    return () => {
      websocket();
    };
  }, [chatId]);
};
