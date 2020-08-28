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
    const swapContract = new web3.eth.Contract(
      ethereum.contract,
      '0x33b4161732B863B8C79957D1D75660F4E33a60bE',
    )

    /* const daiContract = new web3.eth.Contract(
      ERC20ABI.abi,
      '0xB5E5D0F8C0cbA267CD3D7035d6AdC8eBA7Df7Cdd',
    )
    let approve = await daiContract.methods
      .approve('0x33b4161732B863B8C79957D1D75660F4E33a60bE', 1000000000000)
      .send({
        from: account,
      })
    console.log(approve)

    let allowance = await daiContract.methods
      .allowance(account, '0xB5E5D0F8C0cbA267CD3D7035d6AdC8eBA7Df7Cdd')
      .call()
    console.log(allowance) */

    let amount = [1, 0]

    let res = await swapContract.methods.calc_token_amount(amount, true).call()
    console.log(res)

    let token_amount = cBN(Math.floor(res * 0.99).toString()).toFixed(0, 1)
    console.log(token_amount)

    let response = await swapContract.methods.add_liquidity(amount, 0).send({
      from: account,
    })
    console.log(response)
  }

  const withdraw = async () => {
    const account = ethereum.accounts[0]
    const web3 = ethereum.web3

    const swapContract = new web3.eth.Contract(
      ethereum.contract,
      '0x33b4161732B863B8C79957D1D75660F4E33a60bE',
    )
    /* const daiContract = new web3.eth.Contract(
      ERC20ABI.abi,
      '0xB5E5D0F8C0cbA267CD3D7035d6AdC8eBA7Df7Cdd',
    )

    let approve = await daiContract.methods
      .approve('0x33b4161732B863B8C79957D1D75660F4E33a60bE', 1000000000000)
      .send({
        from: account,
      })
    console.log(approve) */

    /* let allowance = await daiContract.methods
      .allowance(account, '0xB5E5D0F8C0cbA267CD3D7035d6AdC8eBA7Df7Cdd')
      .call()
    console.log(allowance) */
    let amount = [1, 0]

    let res = await swapContract.methods.calc_token_amount(amount, false).call()
    console.log(res)

    let token_amount = cBN(Math.floor(res * 1.01).toString()).toFixed(0, 1)
    console.log(token_amount)

    let response = await swapContract.methods
      .remove_liquidity_imbalance(amount, token_amount)
      .send({
        from: account,
        gas: 1000000,
      })
    console.log(response)
  }

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
