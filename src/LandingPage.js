import React, { useEffect, useState } from 'react'
import './App.css'
import getWeb3 from './helper/getWeb3'
import { BigNumber } from 'bignumber.js'
import swapABI from './helper/contractABI'
import ERC20ABI from './helper/ERC20ABI'

const LandingPage = () => {
  const [ethereum, setEthereum] = useState({
    web3: null,
    contract: null,
    accounts: null,
    amount: 1,
  })

  useEffect(() => {
    async function getweb3() {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const contract = swapABI.abi

      setEthereum({
        accounts: accounts,
        web3: web3,
        contract: contract,
      })
    }
    getweb3()
  }, [])

  /* const coin_precisions = [1e18, 1e6, 1e6, 1e18]
  const tethered = [false, false, true, false]
  var use_lending = [true, true, true, true] */

  const deposit = async () => {
    const account = ethereum.accounts[0]
    const web3 = ethereum.web3
    const contract = new web3.eth.Contract(
      ethereum.contract,
      '0x33b4161732B863B8C79957D1D75660F4E33a60bE',
    )
    const daiContract = new web3.eth.Contract(
      ERC20ABI.abi,
      '0xc2118d4d90b274016cB7a54c03EF52E6c537D957',
    )
    /*    let approve = await daiContract.methods
      .approve('0x33b4161732B863B8C79957D1D75660F4E33a60bE', 1000000000000)
      .send({
        from: '0x877427CCBd3061Affd5c6518bc87799B9Cf3C408',
      })
    console.log(approve) */

    let allowance = await daiContract.methods
      .allowance(account, '0x33b4161732B863B8C79957D1D75660F4E33a60bE')
      .call()
    console.log(allowance)
    let amount = [0, 10]

    let res = await contract.methods.calc_token_amount(amount, true).call()

    let token_amount = cBN(Math.floor(res * 0.99).toString()).toFixed(0, 1)
    console.log(token_amount)

    let response = await contract.methods.add_liquidity([10, 0], 0).send({
      from: account,
    })
  }
  const withdraw = () => {}

  const cBN = (val) => {
    return new BigNumber(val)
  }

  return (
    <section className='landing'>
      <div className='light-overlay'>
        <div className='landing-inner'>
          <div className='buttons'>
            <button onClick={() => deposit()} className='btn btn-primary'>
              Deposit
            </button>
            <button onClick={() => withdraw()} className='btn btn-primary'>
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
