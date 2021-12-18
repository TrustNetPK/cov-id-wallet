import { useContext } from "react";
import { Network } from "../context/NetworkContext";

const useNetwork = () => {

    const { isConnected } = useContext(Network);
    return { isConnected };
}

export default useNetwork;
