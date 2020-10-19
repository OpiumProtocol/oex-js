/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as requests from './requests'

// Config
import { Namespace, endpoints } from '../config'
import { ApiOptionsArguments, ApiOptions } from './types'

// Utils
import {
  EIP712Message,
  Orderbook,
  Tickers,
  Orders,
  Trade,
  Meta,
  Wallet
} from '../Utils/types'

export enum ApiError {
  Unauthorized = 'Unauthorized',
  IncorrectauthAddress = 'IncorrectauthAddress',
  ExpiredToken = 'ExpiredToken'
}

/**
 * OEX HTTP
 */
export default class Api {
  private readonly _options: ApiOptions
  protected readonly _endpoint: string

  protected _authAddress: string | null = null
  protected _signature: string | null = null

  public constructor (options?: ApiOptionsArguments) {
    // Options
    const defaultOptions: ApiOptions = {
      namespace: Namespace.production
    }

    this._options = {
      ...defaultOptions,
      ...options
    }

    this._endpoint = endpoints[this._options.namespace]
  }

  // ================= HTTP API =================
  // Auth
  public getAuthLoginData (): Promise<EIP712Message> {
    return requests.auth.get(this._endpoint)
  }

  // Orderbook
  public postOrderForm (
    order: Orderbook.PostOrderbookForm.RequestBody,
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): Promise<Orderbook.PostOrderbookForm.ResponseBody> {
    return requests.orderbook.form(
      this._endpoint,
      order,
      authAddress,
      signature
    )
  }

  public postOrderSign (
    order: Orderbook.PostOrderbook.RequestBody,
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): Promise<unknown> {
    return requests.orderbook.sign(
      this._endpoint,
      order,
      authAddress,
      signature
    )
  }

  public putOrdersCancel (
    query: Orderbook.PutOrderbookCancel.RequestQuery,
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): Promise<unknown> {
    return requests.orderbook.cancel(
      this._endpoint,
      query,
      authAddress,
      signature
    )
  }

  public getOrderPreSubmit (
    query: Orderbook.GetOrderbookPreSubmit.RequestQuery,
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): Promise<Orderbook.GetOrderbookPreSubmit.ResponseBody> {
    return requests.orderbook.preSubmit(
      this._endpoint,
      query,
      authAddress,
      signature
    )
  }

  // Helpers
  public set authAddress (authAddress: string) {
    this._authAddress = authAddress
  }

  public set signature (signature: string) {
    this._signature = signature
  }

  // meta
  public metaConfig (): Promise<Meta.GetMetaConfig.ResponseBody> {
    return requests.meta.config(this._endpoint)
  }

  public metaTickersSearch (
    query: Partial<Meta.GetMetaTickersSearchParams.RequestQuery>
  ): Promise<Meta.GetMetaTickersSearchParams.ResponseBody> {
    return requests.meta.tickersSearchParams(this._endpoint, query)
  }

  // wallet
  public walletTokenBalance (
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): Promise<Wallet.GetWalletBalanceTokens.ResponseBody> {
    return requests.wallet.tokenBalance(this._endpoint, authAddress, signature)
  }

  // tickers
  public tickersGetAll (
    query: Partial<Tickers.GetTickers.RequestQuery>
  ): Promise<Tickers.GetTickers.ResponseBody> {
    return requests.tickers.all(this._endpoint, query)
  }

  public tickersGetData (
    hash: string
  ): Promise<Tickers.GetTickersData.ResponseBody> {
    return requests.tickers.data(this._endpoint, { hash })
  }

  public tickersGetDerivatives (
    query: Partial<Tickers.GetTickersDerivatives.RequestQuery>
  ): Promise<unknown> {
    return requests.tickers.derivatives(this._endpoint, query)
  }

  // trades
  public tradesGetAllTradesByAddress (
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): Promise<Trade.GetAllTradesByAddress.ResponseBody> {
    return requests.trades.allAddress(this._endpoint, authAddress, signature)
  }

  // orders
  public ordersGetAllOrdersByAddress (
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): Promise<Orders.GetAllOrdersByAddress.ResponseBody> {
    return requests.orders.allAddresses(this._endpoint, authAddress, signature)
  }
}
