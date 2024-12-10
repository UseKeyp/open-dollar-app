/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PopulatedTransaction,
    Signer,
    utils,
} from 'ethers'
import { FunctionFragment, Result, EventFragment } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener } from './common'

export interface Erc20Interface extends utils.Interface {
    functions: {
        'name()': FunctionFragment
        'approve(address,uint256)': FunctionFragment
        'totalSupply()': FunctionFragment
        'transferFrom(address,address,uint256)': FunctionFragment
        'decimals()': FunctionFragment
        'balanceOf(address)': FunctionFragment
        'symbol()': FunctionFragment
        'transfer(address,uint256)': FunctionFragment
        'allowance(address,address)': FunctionFragment
    }

    encodeFunctionData(functionFragment: 'name', values?: undefined): string
    encodeFunctionData(functionFragment: 'approve', values: [string, BigNumberish]): string
    encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string
    encodeFunctionData(functionFragment: 'transferFrom', values: [string, string, BigNumberish]): string
    encodeFunctionData(functionFragment: 'decimals', values?: undefined): string
    encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string
    encodeFunctionData(functionFragment: 'symbol', values?: undefined): string
    encodeFunctionData(functionFragment: 'transfer', values: [string, BigNumberish]): string
    encodeFunctionData(functionFragment: 'allowance', values: [string, string]): string

    decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result

    events: {
        'Approval(address,address,uint256)': EventFragment
        'Transfer(address,address,uint256)': EventFragment
    }

    getEvent(nameOrSignatureOrTopic: 'Approval'): EventFragment
    getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment
}

export type ApprovalEventFilter = TypedEventFilter<
    [string, string, BigNumber],
    { from: string; to: string; value: BigNumber }
>

export type TransferEventFilter = TypedEventFilter<
    [string, string, BigNumber],
    { from: string; to: string; value: BigNumber }
>

export interface Erc20 extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this
    attach(addressOrName: string): this
    deployed(): Promise<this>

    listeners<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
    ): Array<TypedListener<EventArgsArray, EventArgsObject>>
    off<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
        listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this
    on<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
        listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this
    once<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
        listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this
    removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
        listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this
    removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
    ): this

    listeners(eventName?: string): Array<Listener>
    off(eventName: string, listener: Listener): this
    on(eventName: string, listener: Listener): this
    once(eventName: string, listener: Listener): this
    removeListener(eventName: string, listener: Listener): this
    removeAllListeners(eventName?: string): this

    queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
        event: TypedEventFilter<EventArgsArray, EventArgsObject>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>

    functions: {
        name(overrides?: CallOverrides): Promise<[string]>

        approve(
            _spender: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>

        transferFrom(
            _from: string,
            _to: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        decimals(overrides?: CallOverrides): Promise<[number]>

        balanceOf(_owner: string, overrides?: CallOverrides): Promise<[BigNumber] & { balance: BigNumber }>

        symbol(overrides?: CallOverrides): Promise<[string]>

        transfer(
            _to: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        allowance(_owner: string, _spender: string, overrides?: CallOverrides): Promise<[BigNumber]>
    }

    name(overrides?: CallOverrides): Promise<string>

    approve(
        _spender: string,
        _value: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>

    transferFrom(
        _from: string,
        _to: string,
        _value: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    decimals(overrides?: CallOverrides): Promise<number>

    balanceOf(_owner: string, overrides?: CallOverrides): Promise<BigNumber>

    symbol(overrides?: CallOverrides): Promise<string>

    transfer(
        _to: string,
        _value: BigNumberish,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    allowance(_owner: string, _spender: string, overrides?: CallOverrides): Promise<BigNumber>

    callStatic: {
        name(overrides?: CallOverrides): Promise<string>

        approve(_spender: string, _value: BigNumberish, overrides?: CallOverrides): Promise<boolean>

        totalSupply(overrides?: CallOverrides): Promise<BigNumber>

        transferFrom(_from: string, _to: string, _value: BigNumberish, overrides?: CallOverrides): Promise<boolean>

        decimals(overrides?: CallOverrides): Promise<number>

        balanceOf(_owner: string, overrides?: CallOverrides): Promise<BigNumber>

        symbol(overrides?: CallOverrides): Promise<string>

        transfer(_to: string, _value: BigNumberish, overrides?: CallOverrides): Promise<boolean>

        allowance(_owner: string, _spender: string, overrides?: CallOverrides): Promise<BigNumber>
    }

    filters: {
        'Approval(address,address,uint256)'(
            owner?: string | null,
            spender?: string | null,
            value?: null
        ): ApprovalEventFilter
        Approval(owner?: string | null, spender?: string | null, value?: null): ApprovalEventFilter

        'Transfer(address,address,uint256)'(from?: string | null, to?: string | null, value?: null): TransferEventFilter
        Transfer(from?: string | null, to?: string | null, value?: null): TransferEventFilter
    }

    estimateGas: {
        name(overrides?: CallOverrides): Promise<BigNumber>

        approve(
            _spender: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        totalSupply(overrides?: CallOverrides): Promise<BigNumber>

        transferFrom(
            _from: string,
            _to: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        decimals(overrides?: CallOverrides): Promise<BigNumber>

        balanceOf(_owner: string, overrides?: CallOverrides): Promise<BigNumber>

        symbol(overrides?: CallOverrides): Promise<BigNumber>

        transfer(
            _to: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        allowance(_owner: string, _spender: string, overrides?: CallOverrides): Promise<BigNumber>
    }

    populateTransaction: {
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>

        approve(
            _spender: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>

        transferFrom(
            _from: string,
            _to: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>

        balanceOf(_owner: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

        symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>

        transfer(
            _to: string,
            _value: BigNumberish,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        allowance(_owner: string, _spender: string, overrides?: CallOverrides): Promise<PopulatedTransaction>
    }
}
