import { createContext, ReactNode } from 'react';
import fetchAdapter from '../http/fetch/fetchAdapter';
import { HttpUserGateway } from './http/auth/httpUserGateway.local';
interface GatewayContextType {

}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

interface GatewayProviderProps {
  children: ReactNode;
}

function GatewayProvider({ children }: GatewayProviderProps) {
  const httpClient = new fetchAdapter();
  const userGateway = new HttpUserGateway(httpClient);

  return (
    <GatewayContext.Provider value={{ userGateway }}>
      {children}
    </GatewayContext.Provider>
  );
}

export { GatewayContext, GatewayProvider };
