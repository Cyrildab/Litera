// src/context/UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "../graphql/queries/me";

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    } else {
      setUser(null);
    }
  }, [data]);

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
};
