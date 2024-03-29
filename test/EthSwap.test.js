const { assert } = require('chai')
const { default: Web3 } = require('web3')

const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {

    return web3.utils.toWei(n, 'Ether')
}

contract('EthSwap', ([deployer, investor]) => { //Se reciben 2 cuentas (Ganache#1 y Ganache#2)

    let ethSwap, token;

    before(async () => {

        token = await Token.new()
        
        ethSwap = await EthSwap.new(token.address)

        //Transfer all tokens to EthSwap (1Millon)
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('Token deployment', async () => {

        it('Token contract has a name', async () => {

            const name = await token.name()

            assert.equal(name, 'DApp Token')
        })
    })

    describe('EthSwap deployment', async () => {

        it('EthSwap contract has a name', async () => {

            const name = await ethSwap.name()

            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has tokens', async () => {

            let balance = await token.balanceOf(ethSwap.address)

            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Buy tokens', async () => {

        let result;

        before(async () => {

            //Purchase tokens before each example
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'Ether') }) 
        })

        it('Allows users to instantly purchase tokens from ethSwap for a fixed price', async () => {

            //Check investor token balance after purchase
            
            let balance = await token.balanceOf(investor) 
                //Ponemos el balance de Tokens porque en el buyTokens lo que hacemos es transferir Tokens.sol 

            assert.equal(balance.toString(), tokens('100')) //Ponemos 100 tokens porque la compra son 100 Ethers y 100 Ethers = 100 + 18 ceros weis

            /* -------------- SEPARATOR -------------- */

            let ethBalance

            ethBalance = await token.balanceOf(ethSwap.address)

            assert.equal(ethBalance.toString(), tokens('999900')) 
                //Como compramos 100 tokens y en total tenemos 1.000.000, queda la resta

            /* -------------- SEPARATOR -------------- */

            ethBalance = await web3.eth.getBalance(ethSwap.address) //Cogemos el balance de ethSwap que hay en la address de ethSwap

            assert.equal(ethBalance.toString(), web3.utils.toWei('1', 'Ether')) //Comprobamos que son 100 Ethers lo que tenemos (lo que hemos comprado)

            /* -------------- SEPARATOR -------------- */

            const event = result.logs[0].args 
                //En los logs del resultado de la compra (donde está el evento) se muestra el evento, cogemos el primero y el objeto 'args'

            assert.equal(event.account, investor) //El que llama al evento es el investor
            
            assert.equal(event.token, token.address) //La moneda que se compra es Token
            
            assert.equal(event.amount.toString(), tokens('100').toString()) //La cantidad son 100 Ether
            
            assert.equal(event.rate.toString(), '100') //La rate es 100
        })
    })

    describe('Sell tokens', async () => {

        let result;

        before(async () => {

            //Cuando llamamos al metodo transferFrom debemos aprobar siempre la transacción
            await token.approve(ethSwap.address, tokens('100'), { from: investor })

            //Investor sell the tokens
            result = await ethSwap.sellTokens(tokens('100'), { from: investor })
        })

        it('Allows users to instantly sell tokens to ethSwap for a fixed price', async () => {

            //Check investor token balance after purchase (balanceOf is from the contract, so we don't need the token.address)
            let investorBalance = await token.balanceOf(investor)

            assert.equal(investorBalance.toString(), tokens('0'))

            /* -------------- SEPARATOR -------------- */

            //Check ethSwap balance after the purchase
            let ethBalance

            //Primero cogemos el balance de ethSwap en el smart contract Token
            ethBalance = await token.balanceOf(ethSwap.address) 

            //Debe de ser 1.000.000 porque hemos vuelto a recuperar los 100 perdidos
            assert.equal(ethBalance, tokens('1000000'))

            /* -------------- SEPARATOR -------------- */

            //Cogemos el balance que tenemos en la dirección de ethSwap
            ethBalance = await web3.eth.getBalance(ethSwap.address)

            //Debe de ser 0 porque hemos vendido todo
            assert.equal(ethBalance.toString(), web3.utils.toWei('0', 'Ether'))

            /* -------------- SEPARATOR -------------- */

            const event = result.logs[0].args 
                //En los logs del resultado de la compra (donde está el evento) se muestra el evento, cogemos el primero y el objeto 'args'

            assert.equal(event.account, investor) //El que llama al evento es el investor
            
            assert.equal(event.token, token.address) //La moneda que se vende es Token
            
            assert.equal(event.amount.toString(), tokens('100').toString()) //La cantidad son 100 Ether
            
            assert.equal(event.rate.toString(), '100') //La rate es 100

            /* -------------- SEPARATOR -------------- */

            //FAILURE: investor can't seel more tokens than they have

            await ethSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
        })
    })
})