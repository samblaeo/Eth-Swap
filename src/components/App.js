import React, { Component } from 'react';
import Navbar from './Nabvar.js'
import Main from './Main.js'
import Web3 from 'web3';
import './App.css';
import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';

class App extends Component {

  async componentWillMount() { //Special function called before all 

    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  /**
   * Load the web 3
   */

  async loadWeb3() {
    if (window.etheruem) {
      window.web3 = new Web3(window.etheruem)
      await window.etheruem.enable()
      await window.ethereum.send('eth_requestAccounts'); //This request to metamask the connection
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      await window.ethereum.send('eth_requestAccounts'); //This request to metamask the connection
    }
    else {
      window.alert('Non etheruem browser detected. You should consider trying to install metamask')
    }
  }

  /**
   * Load the blockchain data
   */

  async loadBlockchainData() {

    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()

    this.setState({ account: accounts[0]})

    const ethSwapBalance = await web3.eth.getBalance(this.state.account)

    this.setState({ ethSwapBalance }) //Si la variable y el valor tienen el mismo nombre, no hace falta poner ethSwapBalance: ethSwapBalance

    //Load token
    const networkId = await web3.eth.net.getId() //Luego cogemos el network id

    const tokenData = Token.networks[networkId] //Guardamos el networkId

    if(tokenData) {

      const token = await new web3.eth.Contract(Token.abi, tokenData.address) //Y creamos el token con el abi y con el address

      this.setState( { token } )//Si la variable y el valor tienen el mismo nombre, no hace falta poner token: token

      let tokenBalance = await token.methods.balanceOf(this.state.account).call() //Cogemos el balance de tokens con la cuenta con el propio metodo de Token.sol

      this.setState( { tokenBalance: tokenBalance.toString() } )
    } else {

      window.alert('Token contract not deployed to detected network')
    }

    //Load token
    const ethSwapData = EthSwap.networks[networkId] //Guardamos el networkId

    if(ethSwapData) {

      const ethSwap = await new web3.eth.Contract(EthSwap.abi, ethSwapData.address) //Y creamos el token con el abi y con el address

      this.setState( { ethSwap } )//Si la variable y el valor tienen el mismo nombre, no hace falta poner token: token
    } else {

      window.alert('Token contract not deployed to detected network')
    }

    this.setState( { loading: false } )
  }

  buyTokens = (etherAmount) => {

    this.setState({loading: true})

    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({loading: false })
    })
  }

  /**
   * Constructor function
   * @param {props} props 
   */
  constructor(props) {

    super(props)

    this.state = {

      account: '',
      token: {},
      ethSwap: {},
      tokenBalance: 0,
      ethSwapBalance: 0,
      loading: true
    }
  }

  render() {

    let content

    if(this.state.loading) 
      content = <p id="loader" className="text-center">Loading...</p>
     else 
      content = <Main 
                ethSwapBalance = {this.state.ethSwapBalance}
                tokenBalance = {this.state.tokenBalance}
                buyTokens = {this.buyTokens} //Así pasamos una función

      />
    

    return (
      <div>
        <Navbar account = {this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                { content }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
