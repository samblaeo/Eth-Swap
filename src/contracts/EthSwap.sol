pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {

    //Code goes here

    string public name = "EthSwap Instant Exchange";

    Token public token; //Se crea una variable que representa al Smart Contract 'Token'

    uint public rate = 100; // Por cada ethereum se reciben 100Dapp, por eso el rate es 100

    event TokenPurchased(
        address account, //Cuenta que lanza la compra
        address token,   //Token que se está comprando
        uint amount,     //Cantidad de tokens
        uint rate        //Rate de moneda a otra
    );

    //Pasamos el token en el constructor 
    //ESTO IMPLICA AÑADIR EL PARAMETRO CADA VEZ QUE SE CREE UNA INSTANCIA DE ESTE OBJETO
    constructor(Token _token) public {

        token = _token;
    }

    function buyTokens() public payable {

        //Calculate the number of tokens to buy (Ether * rate to get the token amount)
        uint tokenAmount = msg.value * rate;
        
        //Require that EthSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount); //El balance de tokens tiene que ser mayor o igual a tokenAmount

        //Transfer tokens to the user
        token.transfer(msg.sender, tokenAmount);// Le transferimos la cantidad de tokens (_amount) al que realiza la acción (msg.sender)

        //Emmit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public payable {

        // Calculate the amount of ether to redeem (Amount / rate to get the ether amount)
        uint etherAmount = _amount / rate; 

        // Perform sale (from the investor to the EthSwap)
        token.transferFrom(msg.sender, address(this), _amount);

        msg.sender.transfer(etherAmount);
    }
}