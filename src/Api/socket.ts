import SocketIoClient, { Socket } from 'socket.io-client'
import { ORDER_ACTION } from '../Utils/types'

export enum SocketChannels {
  CHART_ASSET = 'chart:asset',
  CHART_DERIV = 'chart:deriv',
  ORDERBOOK_ORDERS_TICKER = 'orderbook:orders:ticker',
  ORDERBOOK_ORDERS_MAKER_ADDRESS = 'orderbook:orders:makerAddress',
  ORDERBOOK_ORDERS_OVERVIEW = 'orderbook:orders:overview',
  POSITION_ADDRESS = 'positions:address',
  TRADES_TICKER_ALL = 'trades:ticker:all',
  TRADES_TICKER_ADDRESS = 'trades:ticker:address',
  DERIVATIVE_STATS = 'derivative:stats'
}

export type ChartAssetParameters = {
  /** Oracle id */
  o: string
  /** Candle size, values: 1$m/30$m/1$h/2$h/4$d/12$h/1$d/3$d/5$d/1$w/all */
  s: string
}

export type ChartAssetReturns = {
  ch: SocketChannels.CHART_ASSET
  a: 'set'
  p: ChartAssetParameters
  d: Array<{
    /** open */
    o: number
    /** high */
    h: number
    /** low */
    l: number
    /** close */
    c: number
    /** volume */
    v: number
    /** timestamp */
    t: number
  }>
}

export type ChartDerivParameters = {
  /** ticker hash */
  t: string
  /** candle size 1$m/30$m/1$h/2$h/4$d/12$h/1$d/3$d/5$d/1$w/all */
  s: string
  /** currency */
  c: string
}

export type ChartDerivReturns = {
  ch: SocketChannels.CHART_DERIV
  a: 'set'
  p: ChartDerivParameters
  d: Array<{
    /** open */
    o: number
    /** high */
    h: number
    /** low */
    l: number
    /** close */
    c: number
    /** volume */
    v: number
    /** timestamp */
    t: number
  }>
}

export type OrderbookOrdersTickerParameters = {
  /** ticker hash */
  t: string
  /** currency */
  c: string
}

export type OrderbookOrdersTickerReturns = {
  ch: SocketChannels.ORDERBOOK_ORDERS_TICKER
  a: 'set'
  p: OrderbookOrdersTickerParameters
  d: Array<{
    /** action BID, ASK */
    a: string
    /** price, */
    p: number
    /** volume, */
    v: number
    /** commulative */
    c: number
  }>
}

export type OrderbookOrdersMakerAddressParameters = {
  /** ticker hash */
  t: string
  /** currency */
  c: string
  /** maker address to fetch orders for, */
  addr: string
  /** Signature (access token) */
  sig: string
}

export type OrderbookOrdersMakerAddressReturns = {
  ch: SocketChannels.ORDERBOOK_ORDERS_MAKER_ADDRESS
  a: 'set'
  p: OrderbookOrdersMakerAddressParameters
  d: Array<{
    /** Order id */
    i: string
    /** action BID, ASK */
    a: ORDER_ACTION
    /** price, */
    p: number
    /** quantity, */
    q: number
    /** filled, */
    f: number
    /** matching */
    m: boolean
    /** createdAt, */
    cT: number
    /** expiresAt */
    eT: number
  }>
}

export type OrderbookOrdersOverviewParameters = {
  /** type: option, cds */
  t: string
  /** oracleId */
  o: string
}

export type OrderbookOrderOverviewReturns = {
  ch: SocketChannels.ORDERBOOK_ORDERS_OVERVIEW
  a: 'set'
  p: OrderbookOrdersOverviewParameters
  d: Array<{
    /** ticker hash */
    t: string
    /** ASK size */
    aS: number
    /** ASK price */
    aP: number
    /** BID size */
    bS: number
    /** BID price */
    bP: number
  }>
}

export type PositionAddressParameters = {
  /** public key to fetch positions for */
  addr: string
  /** Signature (access token) */
  sig: string
}

export type PositionAddressReturns = {
  ch: SocketChannels.POSITION_ADDRESS
  a: 'set'
  p: PositionAddressParameters
  d: {
    /** positions */
    pos: Array<{
      /** quantity */
      q: number
      /** tokenId */
      ti: string
      /** type */
      ty: 'LONG' | 'SHORT'
      /** title */
      tt: string
      /** executable */
      ex: boolean
      /** has data */
      hd: boolean
      /** ticker hash */
      th: string
      /** cancel */
      ca: boolean
    }>
    /** portfolios */
    por: Array<{
      /** quantity */
      q: number
      /** tokenId */
      ti: string
      /** positions */
      pos: Array<{
        /** ratio */
        r: number
        /** tokenId */
        ti: string
        /** type */
        ty: 'LONG' | 'SHORT'
        /** title */
        tt: string
        /** ticker hash */
        th: string
        /** cancel */
        ca: boolean
      }>
    }>
  }
}

export type TradesTickerAllParameters = {
  /** ticker hash */
  t: string
  /** currency */
  c: string
}

export type TradesTickerAllReturns = {
  ch: SocketChannels.TRADES_TICKER_ALL
  a: 'set'
  p: TradesTickerAllParameters
  d: Array<{
    /** ISODate */
    t: string
    /** action */
    a: string
    /** price */
    p: number
    /** quantity */
    q: number
    /** txHash */
    tx: string
  }>
}

export type TradesTickerAddressParameters = {
  /** ticker hash */
  t: string
  /** currency */
  c: string
  /** maker address to fetch orders for, */
  addr: string
  /** Signature (access token) */
  sig: string
}

export type TradesTickerAddressReturns = {
  ch: SocketChannels.TRADES_TICKER_ADDRESS
  a: 'set'
  p: TradesTickerAddressParameters
  d: Array<{
    /** ISODate */
    t: string
    /** action */
    a: string
    /** price */
    p: number
    /** quantity */
    q: number
    /** txHash */
    tx: string
  }>
}

export type DerivativeStatsParameters = {
  /** ticker hash */
  t: string
  /** currency */
  c: string
}

export type DerivativeStatsReturns = {
  ch: SocketChannels.DERIVATIVE_STATS
  a: 'set'
  p: DerivativeStatsParameters
  d: Array<{
    /** 24h volume */
    v: number
    /** 24h high */
    h: number
    /** 24h low */
    l: number
  }>
}

type ParamsByChannel<
  TChannel extends SocketChannels
> = TChannel extends SocketChannels.CHART_ASSET
  ? ChartAssetParameters
  : TChannel extends SocketChannels.CHART_DERIV
  ? ChartDerivParameters
  : TChannel extends SocketChannels.ORDERBOOK_ORDERS_TICKER
  ? OrderbookOrdersTickerParameters
  : TChannel extends SocketChannels.ORDERBOOK_ORDERS_MAKER_ADDRESS
  ? OrderbookOrdersMakerAddressParameters
  : TChannel extends SocketChannels.ORDERBOOK_ORDERS_OVERVIEW
  ? OrderbookOrdersOverviewParameters
  : TChannel extends SocketChannels.TRADES_TICKER_ALL
  ? TradesTickerAllParameters
  : TChannel extends SocketChannels.TRADES_TICKER_ALL
  ? TradesTickerAddressParameters
  : TChannel extends SocketChannels.DERIVATIVE_STATS
  ? DerivativeStatsParameters
  : TChannel extends SocketChannels.POSITION_ADDRESS
  ? PositionAddressParameters
  : {}

type ResponseByChannel<
  TChannel extends SocketChannels
> = TChannel extends SocketChannels.CHART_ASSET
  ? ChartAssetReturns
  : TChannel extends SocketChannels.CHART_DERIV
  ? ChartDerivReturns
  : TChannel extends SocketChannels.ORDERBOOK_ORDERS_TICKER
  ? OrderbookOrdersTickerReturns
  : TChannel extends SocketChannels.ORDERBOOK_ORDERS_MAKER_ADDRESS
  ? OrderbookOrdersMakerAddressReturns
  : TChannel extends SocketChannels.ORDERBOOK_ORDERS_OVERVIEW
  ? OrderbookOrderOverviewReturns
  : TChannel extends SocketChannels.TRADES_TICKER_ALL
  ? TradesTickerAllReturns
  : TChannel extends SocketChannels.TRADES_TICKER_ALL
  ? TradesTickerAddressReturns
  : TChannel extends SocketChannels.DERIVATIVE_STATS
  ? DerivativeStatsReturns
  : TChannel extends SocketChannels.POSITION_ADDRESS
  ? PositionAddressReturns
  : {}

export class SocketClient {
  private _socket: typeof Socket

  public constructor (endpoint: string, options?: any) {
    this._socket = SocketIoClient(endpoint, options)
  }

  public on<TChannel extends SocketChannels> (
    channel: TChannel,
    fn: (response: ResponseByChannel<TChannel>) => unknown
  ): this {
    this._socket.on(channel, fn)
    return this
  }

  public off<TChannel extends SocketChannels> (
    channel: TChannel,
    fn: (response: ResponseByChannel<TChannel>) => unknown
  ): this {
    this._socket.off(channel, fn)
    return this
  }

  public subscribe<TChannel extends SocketChannels> (
    channel: TChannel,
    params: ParamsByChannel<TChannel>
  ): this {
    this._socket.emit('subscribe', {
      ch: channel,
      ...params
    })
    return this
  }

  public unsubscribe<TChannel extends SocketChannels> (
    channel: TChannel,
    params: ParamsByChannel<TChannel>
  ): this {
    this._socket.emit('unsubscribe', {
      ch: channel,
      ...params
    })
    return this
  }

  public onError (fn: Function): this {
    this._socket.on('error:message', fn)
    return this
  }

  public offError (fn: Function): this {
    this._socket.off('error:message', fn)
    return this
  }

  public onConnect (fn: Function): this {
    this._socket.on('connect', fn)
    return this
  }

  public close (): void {
    this._socket.close()
  }
}
