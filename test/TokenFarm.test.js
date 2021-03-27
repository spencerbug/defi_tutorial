const { assert } = require('chai')
const { contracts_build_directory } = require('../truffle-config')

const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () => {
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm =await TokenFarm.new(dappToken.address, daiToken.address)

        // transfer all Dapp tokens to the tokenFarm
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))
        //transfer 100 DAI to the investor
        await daiToken.transfer(investor, tokens('100'), { from: owner})
    })

    describe('Mock DAI deployment', async () => {
        it('has a name', async () => {
            let name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })
    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            let name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })
    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            let name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })
        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming Tokens', async () => {
        it('Rewards investors for staking mDai tokens', async () => {
            let result

            // Check investor balance before staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'Investor Mock Dai wallet balance correct before staking')

            // Start staking Mock Dai
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
            await tokenFarm.stakeTokens(tokens('100'), { from: investor })

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0', 'Token Farm Mock DAI balance correct after staking'))
            
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'Investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result, true, 'Investor staking status correct after staking')

            // Issue tokens
            await tokenFarm.issueTokens({from: owner})

            // Check balances after issuance
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuance')
            
            // Ensure only owner can issue tokens
            await tokenFarm.issueTokens({from: investor}).should.be.rejected

            // Unstake tokens
            await tokenFarm.unstakeTokens({from: investor})

            // Check results after staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after unstaking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after unstaking')
            
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'Investor staking balance correct after unstaking')
            
            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
        }) 
    })

})