import { useContext } from "react";
import { Network } from "../context/NetworkContext";
import NetInfo from '@react-native-community/netinfo';


const useNetwork = () => {

    const { isConnected } = useContext(Network);

    const getNetworkInfo = async () => {
        let info = await NetInfo.fetch();
        return info;
    }

    return { isConnected, getNetworkInfo };
}

export default useNetwork;
