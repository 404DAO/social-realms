import { authenticateAndGetClient } from "@/store/ceramicStore";
import { CeramicApi } from "@ceramicnetwork/common";
import CeramicClient from "@ceramicnetwork/http-client";
import { useWeb3React } from "@web3-react/core";
import * as React from "react";

interface ICeramicContext {
  client: CeramicClient | CeramicApi | null | undefined;
  setClient: (client: CeramicClient) => void;
}

export const CeramicContext = React.createContext<ICeramicContext>({
  client: null,
  setClient: () => authenticateAndGetClient(),
});

export const useCeramicContext = () => {
  return React.useContext(CeramicContext);
};

interface ICeramicProvider {
  children: React.ReactNode;
}

export const CeramicProvider = ({ children }: ICeramicProvider) => {
  const web3Context = useWeb3React();
  const { active } = web3Context;

  const [client, setClient] = React.useState<
    CeramicClient | CeramicApi | null | undefined
  >(null);

  const value = { client, setClient };

  const loadCeramicClient = async (isWalletConnected: boolean) => {
    if (isWalletConnected) {
      const ceramicClient = await authenticateAndGetClient();
      setClient(ceramicClient);
    }
  };
  React.useEffect(() => {
    loadCeramicClient(active);
  }, [active]);

  return (
    <CeramicContext.Provider value={value}>{children}</CeramicContext.Provider>
  );
};
