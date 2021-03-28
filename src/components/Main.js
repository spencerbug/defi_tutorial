import React, { Component } from 'react'
import dai from '../dai.png'

class Main extends Component {

  render() {
    return (
      <div id="content" className="mt-3">
        <table className="table tbale-borderless text-muted text-center">
            <thead>
                <tr>
                    <th scope="col">Staking Balance</th>
                    <th scope="col">Reward Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDai</td>
                    <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} mDAPP</td>
                </tr>
            </tbody>
        </table>
        
        <div className="card mb-4">
            <div className="card-body">
                <form action="" className="mb-3" onSubmit={(event) => {
                    event.preventDefault()
                    let amount
                    amount = this.input.value.toString()
                    amount = window.web3.utils.toWei(amount, 'Ether')
                    this.props.stakeTokens(amount)
                }}>
                    <div>
                        <label className="float-left"><b>Stake Tokens</b></label>
                        <span className="float-right text-muted">Balance {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}</span>
                    </div>
                    <div className="input-group mb-4">
                        <input
                            type="text"
                            ref={(input) => {this.input = input}}
                            className="form-control form-contorl-lg"
                            placeholder="0" 
                            required/>
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={dai} alt="" height="32"/>
                                &nbsp;&nbsp;&nbsp; mDai
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-block btn-lg" type="submit">STAKE!</button>
                </form>
                <button className="btn btn-link btn-block btn-sm" type="submit"
                    onClick={(event) => {
                        event.preventDefault()
                        this.props.unstakeTokens()
                    }}>Unstake...
                </button>
                <button className="btn btn-warning btn-block btn-lg" type="submit"
                    onClick={(event) => {
                        event.preventDefault()
                        this.props.claimReward()
                    }}>Claim your reward!
                </button>
            </div>
        </div>
        


      </div>
    );
  }
}

export default Main;
