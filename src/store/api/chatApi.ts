import { api } from "./index";
import { Chat, Message } from "../../types";

export const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<Chat[], void>({
      query: () => "/chats",
      providesTags: ["Chat"],
    }),
    
    getChat: builder.query<Chat, string>({
      query: (chatId) => `/chats/${chatId}`,
      providesTags: (result, error, chatId) => [{ type: "Chat", id: chatId }],
    }),
    
    getMessages: builder.query<Message[], string>({
      query: (chatId) => `/chats/${chatId}/messages`,
      providesTags: (result, error, chatId) => [{ type: "Message", id: chatId }],
    }),
    
    sendMessage: builder.mutation<Message, { chatId: string; content: string; type: string }>({
      query: ({ chatId, content, type }) => ({
        url: `/chats/${chatId}/messages`,
        method: "POST",
        body: { content, type },
      }),
      invalidatesTags: (result, error, { chatId }) => [{ type: "Message", id: chatId }],
    }),
    
    createChat: builder.mutation<Chat, { userId: string; type: "private" | "group"; name?: string }>({
      query: (data) => ({
        url: "/chats",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetChatsQuery,
  useGetChatQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateChatMutation,
} = chatApi;