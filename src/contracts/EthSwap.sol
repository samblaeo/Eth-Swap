pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {

    //Code goes here

    string public name = "EthSwap Instant Exchange";

    Token public token; //Se crea una variable que representa al Smart Contract 'Token'

    uint public rate = 100; // Por cada ethereum se reciben 100Dapp, por eso el rate es 100

    //Pasamos el token en el constructor 
    //ESTO IMPLICA AÑADIR EL PARAMETRO CADA VEZ QUE SE CREE UNA INSTANCIA DE ESTE OBJETO
    constructor(Token _token) public {

        token = _token;
    }

    function buyTokens() public payable {

        //Calculate the number of tokens to buy 
        uint tokenAmount = msg.value * rate;

        token.transfer(msg.sender, tokenAmount);// Le transferimos la cantidad de tokens (_amount) al que realiza la acción (msg.sender)
    }
}