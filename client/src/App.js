import React,{useState,useEffect} from 'react'
import { getWeb3 } from './utils';
import SimpleStorage from "./contracts/SimpleStorage.json";
import {create} from "ipfs-http-client";

const App = () => {
  
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [ipfs,setIpfs] = useState(undefined);
  const [buffer,setBuffer]= useState(undefined);
  const [ipfsHash,setIpfsHash] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      const contract = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const ipfsNode = create('https://ipfs.infura.io:5001');
      const hash = await contract.methods
      .ipfsHash()
      .call()

      setIpfs(ipfsNode);
      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setIpfsHash(hash);
    }
    init();
    console.log("hash",ipfsHash)
    window.ethereum.on('accountsChanged', accounts => {
      setAccounts(accounts);
    });
  }, []);
  
  const isReady = () => {
    return (
      typeof contract !== 'undefined' 
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
      && typeof ipfs !== 'undefined'
    );
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await ipfs.add(buffer);
    await contract.methods.set(result.path).send({from:accounts[0]});
    setIpfsHash(result.path);
  }

  return (
    <div>
      <img src={`https://ipfs.io/ipfs/${ipfsHash}`} alt=""/>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange}/>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default App
