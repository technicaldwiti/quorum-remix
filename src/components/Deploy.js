import React, { useEffect } from 'react'
import { Constructor } from './Constructor'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { addContract, deployContract, selectContract } from '../actions'
import { getConstructor } from '../utils/ContractUtils'

export function Deploy() {
  const txMetadata = useSelector(state => state.txMetadata, shallowEqual)
  const { contracts, selectedContract } = useSelector(
    state => state.compilation)
  const dispatch = useDispatch()

  useEffect(() => {
    // maybe a better way to do this, but select the first contract if unset or
    // if selected contract is no longer in the list of contracts
    if (!(selectedContract in contracts)) {
      dispatch(selectContract(Object.keys(contracts)[0]))
    }
  }, [contracts])


  return <div>
    <div>Compiled Contracts:</div>
    <select className="form-control"
            defaultValue={selectedContract}
            onChange={(e) => dispatch(selectContract(e.target.value))}>
      {Object.entries(contracts).map(
        ([name, data]) => <option key={name} value={name}>{name}</option>)}
    </select>
    {contracts[selectedContract] &&
    <Constructor
      onDeploy={params => dispatch(
        deployContract(params, contracts[selectedContract], txMetadata))}
      onExisting={(address) => {
        console.log('onExisting', address)
        dispatch(addContract(contracts[selectedContract], address, txMetadata))
      }}
      method={getConstructor(contracts[selectedContract].abi)}
    />}
    </div>
}

