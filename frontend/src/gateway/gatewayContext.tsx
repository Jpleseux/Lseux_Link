import { createContext, ReactNode } from 'react';
import fetchAdapter from '../http/axios/axiosAdapter';
import { HttpUserGateway } from './http/auth/httpUserGateway.local';
import { HttpProfileGateway } from './http/profile/httpProfilegateway.local';
interface GatewayContextType {
  userGateway: HttpUserGateway,
  profileGateway: HttpProfileGateway,
}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

interface GatewayProviderProps {
  children: ReactNode;
}

function GatewayProvider({ children }: GatewayProviderProps) {
  const httpClient = new fetchAdapter();
  const userGateway = new HttpUserGateway(httpClient);
  const profileGateway = new HttpProfileGateway(httpClient);

  return (
    <GatewayContext.Provider value={{ userGateway, profileGateway }}>
      {children}
    </GatewayContext.Provider>
  );
}

export { GatewayContext, GatewayProvider };
