import React, { createContext, useEffect, useState } from 'react';
import NetInfo from "@react-native-community/netinfo";

export const Network = createContext({
    isConnected: false,
});

const NetworkContext = ({ children }) => {

    const [isConnected, setConnected] = useState(false);

    useEffect(() => {
        const subscription = NetInfo.addEventListener(state => {
            setConnected(state.isConnected || state.isInternetReachable);
        });
        return (() => {
            subscription;
        })
    }, [])

    return (
        <Network.Provider
            value={{
                isConnected: isConnected,
            }}
        >
            {children}
        </Network.Provider>
    )
}

export default NetworkContext;