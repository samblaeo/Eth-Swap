import React, { Component } from 'react';
import Navbar from './Nabvar.js'
import Web3 from 'web3';
import './App.css';

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


  }

  /**
   * Constructor function
   * @param {props} props 
   */
  constructor(props) {

    super(props)

    this.state = {

      account: '',
      ethSwapBalance: 0
    }
  }

  render() {
    return (
      <div>
        <Navbar account = {this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                <h1>Shield Network</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
