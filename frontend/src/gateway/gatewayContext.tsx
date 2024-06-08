import { createContext, ReactNode } from 'react';
import fetchAdapter from '../http/axios/axiosAdapter';
import { HttpUserGateway } from './http/auth/httpUserGateway.local';
import { HttpProfileGateway } from './http/profile/httpProfilegateway.local';
import { HttpPostGatewayLocal } from './http/posts/httpPostsGateway.local';
import { HttpChatsGateway } from './http/chats/httpChatsGateway.local';
import { HttpNotificationGateway } from './http/notifications/httpNotificationGateway.local';
import { HttpContactsGateway } from './http/contacts/httpContactsGateway';
import { HttpMessagesGateway } from './http/messages/httpMessagesGateway';
interface GatewayContextType {
  userGateway: HttpUserGateway,
  profileGateway: HttpProfileGateway,
  postsGateway: HttpPostGatewayLocal,
  chatsGateway: HttpChatsGateway,
  notificationGateway: HttpNotificationGateway;
  contactsGateway: HttpContactsGateway;
  messagesGateway: HttpMessagesGateway;
}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

interface GatewayProviderProps {
  children: ReactNode;
}

function GatewayProvider({ children }: GatewayProviderProps) {
  const httpClient = new fetchAdapter();
  const userGateway = new HttpUserGateway(httpClient);
  const profileGateway = new HttpProfileGateway(httpClient);
  const postsGateway = new HttpPostGatewayLocal(httpClient);
  const chatsGateway = new HttpChatsGateway(httpClient);
  const notificationGateway = new HttpNotificationGateway(httpClient);
  const contactsGateway = new HttpContactsGateway(httpClient);
  const messagesGateway = new HttpMessagesGateway(httpClient);


  return (
    <GatewayContext.Provider value={{ userGateway, profileGateway,postsGateway, chatsGateway, notificationGateway, contactsGateway, messagesGateway }}>
      {children}
    </GatewayContext.Provider>
  );
}

export { GatewayContext, GatewayProvider };
