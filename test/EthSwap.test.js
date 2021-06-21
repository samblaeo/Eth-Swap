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

contract('EthSwap', (accounts) => {

    let ethSwap, token;

    before(async () => {
        
        ethSwap = await EthSwap.new()

        token = await Token.new()

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
})