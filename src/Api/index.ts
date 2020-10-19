/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as socket from './socket'

// Config
import Api from './api'
import { ApiOptions } from './types'

import {
  ChartDerivParameters,
  OrderbookOrdersTickerParameters,
  OrderbookOrdersMakerAddressParameters,
  OrderbookOrdersOverviewParameters,
  TradesTickerAllParameters,
  TradesTickerAddressParameters,
  DerivativeStatsParameters
} from './socket'

export enum ApiError {
  Unauthorized = 'Unauthorized',
  IncorrectauthAddress = 'IncorrectauthAddress',
  ExpiredToken = 'ExpiredToken'
}

/**
 * Socket.io API
 */
export default class ApiWithSocket extends Api {
  protected readonly _socket: socket.SocketClient

  public constructor (options?: ApiOptions) {
    super(options)
    this._socket = new socket.SocketClient(this._endpoint, {
      'force new connection': true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10
    })
  }

  // ================= Sockets =================

  // Helpers
  public onError (fn: Function): void {
    this._socket.onError(fn)
  }

  public onSocketShutdown(): void {
    this._socket.close()
  }

  // chart:asset
  public subscribeOnChartsAsset (params: socket.ChartAssetParameters): void {
    this._socket.subscribe(socket.SocketChannels.CHART_ASSET, params)
  }

  public unsubscribeOnChartsAsset (payload: socket.ChartAssetParameters): void {
    this._socket.unsubscribe(socket.SocketChannels.CHART_ASSET, payload)
  }

  public onChartsAsset (
    fn: (response: socket.ChartAssetReturns) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.CHART_ASSET, fn)
  }

  public offChartsAsset (
    fn: (response: socket.ChartAssetReturns) => unknown
  ): void {
    this._socket.off(socket.SocketChannels.CHART_ASSET, fn)
  }

  // chart:deriv
  public subscribeOnChartsDeriv (payload: ChartDerivParameters): void {
    this._socket.subscribe(socket.SocketChannels.CHART_DERIV, payload)
  }

  public unsubscribeOnChartsDeriv (payload: ChartDerivParameters): void {
    this._socket.unsubscribe(socket.SocketChannels.CHART_DERIV, payload)
  }

  public onChartsDeriv (
    fn: (response: socket.ChartDerivReturns) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.CHART_DERIV, fn)
  }

  // orderbook:orders:ticker
  public subscribeOnOrderbookOrdersTicker (
    payload: OrderbookOrdersTickerParameters
  ): void {
    this._socket.subscribe(
      socket.SocketChannels.ORDERBOOK_ORDERS_TICKER,
      payload
    )
  }

  public unsubscribeOnOrderbookOrdersTicker (
    payload: OrderbookOrdersTickerParameters
  ): void {
    this._socket.unsubscribe(
      socket.SocketChannels.ORDERBOOK_ORDERS_TICKER,
      payload
    )
  }

  public onOrderbookOrdersTicker (
    fn: (response: socket.OrderbookOrdersTickerReturns) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.ORDERBOOK_ORDERS_TICKER, fn)
  }

  // orderbook:orders:makerAddress
  public subscribeOnOrderbookOrdersMakerAddress (
    payload: Omit<OrderbookOrdersMakerAddressParameters, 'addr' | 'sig'>,
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): void {
    this._socket.subscribe(
      socket.SocketChannels.ORDERBOOK_ORDERS_MAKER_ADDRESS,
      { ...payload, addr: authAddress, sig: signature }
    )
  }

  public unsubscribeOnOrderbookOrdersMakerAddress (
    payload: Omit<OrderbookOrdersMakerAddressParameters, 'addr' | 'sig'>,
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): void {
    this._socket.unsubscribe(
      socket.SocketChannels.ORDERBOOK_ORDERS_MAKER_ADDRESS,
      { ...payload, addr: authAddress, sig: signature }
    )
  }

  public onOrderbookOrdersMakerAddress (
    fn: (response: socket.OrderbookOrdersMakerAddressReturns) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.ORDERBOOK_ORDERS_MAKER_ADDRESS, fn)
  }

  // orderbook:orders:overview
  public subscribeOnOrderbookOrdersOverview (
    payload: Omit<OrderbookOrdersOverviewParameters, 'addr' | 'sig'>
  ): void {
    this._socket.subscribe(socket.SocketChannels.ORDERBOOK_ORDERS_OVERVIEW, {
      ...payload
    })
  }

  public unsubscribeOnOrderbookOrdersOverview (
    payload: OrderbookOrdersOverviewParameters
  ): void {
    this._socket.unsubscribe(
      socket.SocketChannels.ORDERBOOK_ORDERS_OVERVIEW,
      payload
    )
  }

  public onOrderbookOrdersOverview (
    fn: (response: socket.OrderbookOrderOverviewReturns) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.ORDERBOOK_ORDERS_OVERVIEW, fn)
  }

  // positions:address
  public subscribePositions (
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): void {
    this._socket.subscribe(socket.SocketChannels.POSITION_ADDRESS, {
      addr: authAddress,
      sig: signature
    })
  }

  public unsubscribePositions (
    authAddress: string = this._authAddress!,
    signature: string = this._signature!
  ): void {
    this._socket.unsubscribe(socket.SocketChannels.POSITION_ADDRESS, {
      addr: authAddress,
      sig: signature
    })
  }

  public onPositions (
    fn: (response: socket.PositionAddressReturns) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.POSITION_ADDRESS, fn)
  }

  // trades:ticker:all
  public subscribeOnTradesTickerAll (payload: TradesTickerAllParameters): void {
    this._socket.subscribe(socket.SocketChannels.TRADES_TICKER_ALL, payload)
  }

  public unsubscribeOnTradesTickerAll (
    payload: TradesTickerAllParameters
  ): void {
    this._socket.unsubscribe(socket.SocketChannels.TRADES_TICKER_ALL, payload)
  }

  public onTradesTickerAll (
    fn: (response: socket.TradesTickerAllReturns) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.TRADES_TICKER_ALL, fn)
  }

  // trades:ticker:address
  public subscribeOnTradesTickerAddress (
    payload: Omit<TradesTickerAddressParameters, 'addr' | 'sig'>,
    authAddress = this._authAddress,
    signature = this._signature
  ): void {
    this._socket.subscribe(socket.SocketChannels.TRADES_TICKER_ADDRESS, {
      ...payload,
      addr: authAddress,
      sig: signature
    })
  }

  public unsubscribeOnTradesTickerAddress (
    payload: Omit<TradesTickerAddressParameters, 'addr' | 'sig'>,
    authAddress = this._authAddress,
    signature = this._signature
  ): void {
    this._socket.unsubscribe(socket.SocketChannels.TRADES_TICKER_ADDRESS, {
      ...payload,
      addr: authAddress,
      sig: signature
    })
  }

  public onTradesTickerAddress (
    fn: (response: Partial<socket.TradesTickerAddressReturns>) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.TRADES_TICKER_ADDRESS, fn)
  }

  // derivative:stats
  public subscribeOnDerivativeStats (payload: DerivativeStatsParameters): void {
    this._socket.subscribe(socket.SocketChannels.DERIVATIVE_STATS, payload)
  }

  public unsubscribeOnDerivativeStats (
    payload: DerivativeStatsParameters
  ): void {
    this._socket.unsubscribe(socket.SocketChannels.DERIVATIVE_STATS, payload)
  }

  public onDerivativeStats (
    fn: (response: socket.DerivativeStatsReturns) => unknown
  ): void {
    this._socket.on(socket.SocketChannels.DERIVATIVE_STATS, fn)
  }
}
