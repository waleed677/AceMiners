import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "./../../redux/data/dataActions";
import * as s from "./../../styles/globalStyles";
import whitelistAddresses from "../walletAddresses";
import earlyAccessAddresses from "../walletAddressesEarlyAccess";
import Loader from "../../components/Loader/loader";
// Add this import line at the top
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3("https://eth-mainnet.alchemyapi.io/v2/DWS-10QG2tUKcNhG_nUqMvkRQT8pwwyv");
var Web3 = require('web3');
var Contract = require('web3-eth-contract');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// Whitelist MerkleTree
const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();
console.log('Whitelist Merkle Tree\n', merkleTree.toString());


// EarlyAccess MerkleTree
const leafNodesEarly = earlyAccessAddresses.map(addr => keccak256(addr));
const merkleTreeEarly = new MerkleTree(leafNodesEarly, keccak256, { sortPairs: true });
const rootHashEarly = merkleTreeEarly.getRoot();
console.log('Early Access Tree\n', merkleTreeEarly.toString());



function Home() {

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintDone, setMintDone] = useState(false);
  const [supply, setTotalSupply] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [statusAlert, setStatusAlert] = useState("");
  const [mintAmount, setMintAmount] = useState(1);
  const [displayCost, setDisplayCost] = useState(0);
  const [state, setState] = useState(-1);
  const [nftCost, setNftCost] = useState(-1);
  const [canMintWL, setCanMintWL] = useState(false);
  const [canMintEA, setCanMintEA] = useState(false);
  const [disable, setDisable] = useState(false);
  const [max, setMax] = useState(0);
  const [loading, setLoading] = useState(true);
  const [proof, setProof] = useState([]);
  const [totalMint, setTotalMint] = useState(0);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = async () => {
    let cost = nftCost;
    cost = Web3.utils.toWei(String(cost), "ether");

    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}`);
    setClaimingNft(true);
    setLoading(true);

    // const estGas = await blockchain.smartContract.methods.
    // mint(mintAmount,proof).estimateGas({
    //   from: blockchain.account,
    //   to: CONFIG.CONTRACT_ADDRESS,
    // });
    // console.log({ estGas });

    blockchain.smartContract.methods
      .mint(mintAmount, proof)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
        setLoading(false);
      })
      .then((receipt) => {
        setLoading(false);
        setMintDone(true);
        setFeedback(`Congratulation, your mint is successful.`);
        setClaimingNft(false);
        blockchain.smartContract.methods
          .totalSupply()
          .call()
          .then((res) => {
            setTotalSupply(res);
          });
        dispatch(fetchData(blockchain.account));
        getData();
      });

  };


  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
    setDisplayCost(
      parseFloat(nftCost * newMintAmount).toFixed(2)
    );
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    newMintAmount > max
      ? (newMintAmount = max)
      : newMintAmount;
    setDisplayCost(
      parseFloat(nftCost * newMintAmount).toFixed(2)
    );
    setMintAmount(newMintAmount);
  };

  const maxNfts = () => {
    setMintAmount(max);

    setDisplayCost(
      parseFloat(nftCost * max).toFixed(2)
    );

  };

  const getData = async () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      const totalSupply = await blockchain.smartContract.methods
        .totalSupply()
        .call();
      setTotalSupply(totalSupply);
      let currentState = await blockchain.smartContract.methods
        .currentState()
        .call();
      setState(currentState);

      //  no of nfts minted by user
      let nftMintedByUser = await blockchain.smartContract.methods
        .mintableAmountForUser(blockchain.account)
        .call();
      setMax(nftMintedByUser);
      console.log({ nftMintedByUser });

      // Nft states
      if (currentState == 1) {
        let totalWLNfts = 54;
        supply < totalWLNfts && nftMintedByUser != 0 ? setDisable(false) : setDisable(true);
        const claimingAddress = keccak256(blockchain.account);
        // `getHexProof` returns the neighbour leaf and all parent nodes hashes that will
        // be required to derive the Merkle Trees root hash.
        const hexProof = merkleTree.getHexProof(claimingAddress);
        setProof(hexProof);
        let mintWL = merkleTree.verify(hexProof, claimingAddress, rootHash);
        let mintWLContractMethod = await blockchain.smartContract.methods
          .isWhitelisted(blockchain.account, hexProof)
          .call();
        if (mintWLContractMethod && mintWL) {
          setCanMintWL(mintWL);
          setFeedback(`Welcome Whitelist Member, you can mint up to ${nftMintedByUser} NFTs`)
        } else {
          setFeedback(`Sorry, your wallet is not on the whitelist`);
          setDisable(true);
        }
      } else if (currentState == 2) {
        let totalEANfts = 150;
        supply < totalEANfts && nftMintedByUser != 0 ? setDisable(false) : setDisable(true);
        const claimingAddress = keccak256(blockchain.account);
        const hexProof = merkleTreeEarly.getHexProof(claimingAddress);
        setProof(hexProof);
        let mintEarly = merkleTreeEarly.verify(hexProof, claimingAddress, rootHashEarly);
        let mintEAContractMethod = await blockchain.smartContract.methods
          .isEarlyAccess(blockchain.account, hexProof)
          .call();
        if (mintEAContractMethod && mintEarly) {
          setCanMintEA(mintEarly);
          setFeedback(`Welcome Early Access Member, you can mint up to ${nftMintedByUser} NFTs`)
        } else {
          setFeedback(`Sorry, your wallet is not on the Early Access list`);
          setDisable(true);
        }
      }
      else {
        let totalPublic = 500;
        supply < totalPublic ? setDisable(false) : setDisable(true);
        setFeedback(`Welcome, you can mint up to ${nftMintedByUser} NFTs per transaction`)
      }
    }
  };

  const getDataWithAlchemy = async () => {
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });


    const abi = await abiResponse.json();
    var contract = new Contract(abi, '0x0770a317AF574fBa15F205A60bCA9075206ad0a8');
    contract.setProvider(web3.currentProvider);
    // Get Total Supply
    const totalSupply = await contract.methods
      .totalSupply()
      .call();
    setTotalSupply(totalSupply);

    // Get Contract State
    let currentState = await contract.methods
      .currentState()
      .call();
    setState(currentState);

    // Set Price and Max According to State

    if (currentState == 0) {
      setStatusAlert("MINT NOT LIVE YET!");
      setDisable(true);
      setDisplayCost(0.00);
      setMax(0);
    }
    else if (currentState == 2) {
      setStatusAlert("EARLY ACCESS IS NOW LIVE!");
      let earlyAccessCost = await contract.methods
        .costEarlyAccess()
        .call();
      setDisplayCost(web3.utils.fromWei(earlyAccessCost));
      setNftCost(web3.utils.fromWei(earlyAccessCost));
      setFeedback("Have you got the Early Access?");

      let earlyMax = await contract.methods
        .maxMintAmountEarlyAccess()
        .call();
      setMax(earlyMax);
    }
    else if (currentState == 1) {
      let wlCost = await contract.methods
        .costWL()
        .call();
      setDisplayCost(web3.utils.fromWei(wlCost));
      setNftCost(web3.utils.fromWei(wlCost));
      setStatusAlert("WHITELIST IS NOW LIVE!");
      setFeedback("Are you Whitelisted Member?");

      let wlMax = await contract.methods
        .maxMintAmountWL()
        .call();
      setMax(wlMax);
    }
    else {
      let puCost = await contract.methods
        .cost()
        .call();
      setDisplayCost(web3.utils.fromWei(puCost));
      setNftCost(web3.utils.fromWei(puCost));
      setStatusAlert("Public Mint is Live");
      let puMax = await contract.methods
        .maxMintAmountPublic()
        .call();
      setMax(puMax);
    }

  }

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
    getDataWithAlchemy();
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <>

      {loading && <Loader />}

      <s.FlexContainer jc={"center"} ai={"center"} fd={"row"}
      >
        <s.Mint>
          <s.TextTitle
            size={3.0}
            style={{
              letterSpacing: "3px",

            }}
          >
            {statusAlert}
          </s.TextTitle>
          <s.SpacerSmall />
          <s.SpacerLarge />
          <s.FlexContainer fd={"row"} ai={"center"} jc={"space-between"}>
            <s.TextTitle>Available</s.TextTitle>
            <s.TextTitle color={"var(--primary)"}>
              {CONFIG.MAX_SUPPLY - supply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
          </s.FlexContainer>
          <s.SpacerSmall />
          <s.Line />
          <s.SpacerSmall />
          <s.FlexContainer fd={"row"} ai={"center"} jc={"space-between"}>

            <s.TextTitle>Amount</s.TextTitle>

            <s.AmountContainer ai={"center"} jc={"center"} fd={"row"}>
              <s.StyledRoundButton
                style={{ lineHeight: 0.4 }}
                disabled={claimingNft ? 1 : 0}
                onClick={(e) => {
                  e.preventDefault();
                  decrementMintAmount();
                }}
              >
                -
              </s.StyledRoundButton>
              <s.SpacerMedium />
              <s.TextDescription color={"var(--primary)"} size={"2.5rem"}>
                {mintAmount}
              </s.TextDescription>
              <s.SpacerMedium />
              <s.StyledRoundButton
                disabled={claimingNft ? 1 : 0}
                onClick={(e) => {
                  e.preventDefault();
                  incrementMintAmount();
                }}
              >
                +
              </s.StyledRoundButton>
            </s.AmountContainer>

            <s.maxButton
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                maxNfts();
              }}
            >
              MAX
            </s.maxButton>
          </s.FlexContainer>

          <s.SpacerSmall />
          <s.Line />
          <s.SpacerSmall />
          <s.FlexContainer fd={"row"} ai={"center"} jc={"space-between"}>
            <s.TextTitle>Total Price</s.TextTitle>
            <s.TextTitle color={"var(--primary)"}>{displayCost}</s.TextTitle>
          </s.FlexContainer>
          <s.SpacerSmall />
          <s.Line />

          <s.SpacerLarge />
          {blockchain.account !== "" &&
            blockchain.smartContract !== null &&
            blockchain.errorMsg === "" ? (
            <s.Container ai={"center"} jc={"center"} fd={"row"}>
              <s.connectButton
                disabled={disable}
                onClick={(e) => {
                  e.preventDefault();
                  claimNFTs();
                }}
              >

                {claimingNft ? "Confirm Transaction in Wallet" : "Mint"}
                {/* {mintDone && !claimingNft  ? feedback : ""} */}
              </s.connectButton>{" "}
            </s.Container>
          ) : (
            <>
              {/* {blockchain.errorMsg === "" ? ( */}
              <s.connectButton
                style={{
                  textAlign: "center",
                  color: "#fff",
                  cursor: "pointer",
                }}
                disabled={state == 0 ? 1 : 0}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(connectWallet());
                  getData();
                }}
              >
                Connect Wallet
              </s.connectButton>
              {/* ) : ("")} */}
            </>
          )}
           <s.SpacerLarge />
          <s.Container ai={"center"} jc={"center"} fd={"row"}>
            <CrossmintPayButton
              collectionTitle="Ace Miners NFT"
              collectionDescription="Ace Miners NFT"
              collectionPhoto=""
              clientId="6209efaf-61b5-499d-9707-63ee699306b8"
              mintConfig={{
                count:  String(mintAmount),
                price: String(displayCost)
              }}
             
           
            />
          </s.Container>
          <s.SpacerLarge />
          {blockchain.errorMsg !== "" ? (
            <s.connectButton
              style={{
                textAlign: "center",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {blockchain.errorMsg}
            </s.connectButton>
          ) : (
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {feedback}
            </s.TextDescription>
          )}
        </s.Mint>
      </s.FlexContainer>
    </>
  );
}

export default Home;
