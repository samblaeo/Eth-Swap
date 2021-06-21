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
        })
    })
})