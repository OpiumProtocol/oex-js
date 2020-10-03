import axios, { AxiosResponse } from 'axios'
import queryString from 'query-string'

import {
  EIP712Message,
  Orderbook,
  Meta,
  Wallet,
  Tickers,
  Trade,
  Orders
} from '../Utils/types'

class OEXRequestError extends Error {}

const handleResponse = <T>(response: AxiosResponse<T>) => {
  if (![200, 201, 204, 202].includes(response.status)) {
    throw new OEXRequestError(
      `Received incorrect status code: ${response.status}`
    )
  }
  return response.data
}

export const auth = {
  get: (endpoint: string): Promise<EIP712Message> =>
    axios.get(`${endpoint}/auth/loginData`).then(handleResponse)
}

export const orderbook = {
  form: (
    endpoint: string,
    body: Orderbook.PostOrderbookForm.RequestBody,
    authAddress: string,
    signature: string
  ): Promise<Orderbook.PostOrderbookForm.ResponseBody> =>
    axios
      .post(
        `${endpoint}/orderbook/formOrder?authAddress=${authAddress}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${signature}`
          }
        }
      )
      .then(handleResponse),

  sign: (
    endpoint: string,
    body: Orderbook.PostOrderbook.RequestBody,
    authAddress: string,
    signature: string
  ): Promise<unknown> =>
    axios
      .post(`${endpoint}/orderbook/orders?authAddress=${authAddress}`, body, {
        headers: {
          Authorization: `Bearer ${signature}`
        }
      })
      .then(handleResponse),

  cancel: (
    endpoint: string,
    query: Orderbook.PutOrderbookCancel.RequestQuery,
    authAddress: string,
    signature: string
  ): Promise<void> =>
    axios
      .put(
        `${endpoint}/orderbook/cancel?${queryString.stringify({
          ...query,
          authAddress
        })}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${signature}`
          }
        }
      )
      .then(handleResponse),

  preSubmit: (
    endpoint: string,
    query: Orderbook.GetOrderbookPreSubmit.RequestQuery,
    authAddress: string,
    signature: string
  ): Promise<Orderbook.GetOrderbookPreSubmit.ResponseBody> =>
    axios
      .get(
        `${endpoint}/orderbook/preSubmit?${queryString.stringify({
          ...query,
          authAddress
        })}`,
        {
          headers: {
            Authorization: `Bearer ${signature}`
          }
        }
      )
      .then(handleResponse)
}

export const meta = {
  config: (endpoint: string): Promise<Meta.GetMetaConfig.ResponseBody> =>
    axios.get(`${endpoint}/meta/config`).then(handleResponse),

  tickersSearchParams: (
    endpoint: string,
    query: Partial<Meta.GetMetaTickersSearchParams.RequestQuery>
  ): Promise<Meta.GetMetaTickersSearchParams.ResponseBody> =>
    axios
      .get(
        `${endpoint}/meta/tickers/searchParams?${queryString.stringify(query)}`
      )
      .then(handleResponse)
}

export const wallet = {
  tokenBalance: (
    endpoint: string
  ): Promise<Wallet.GetWalletBalanceTokens.ResponseBody> =>
    axios.get(`${endpoint}/wallet/balance/tokens`).then(handleResponse)
}

export const tickers = {
  all: (
    endpoint: string,
    query: Partial<Tickers.GetTickers.RequestQuery>
  ): Promise<Tickers.GetTickers.ResponseBody> =>
    axios
      .get(`${endpoint}/tickers?${queryString.stringify(query)}`)
      .then(handleResponse),

  data: (
    endpoint: string,
    params: Tickers.GetTickersData.RequestParams
  ): Promise<Tickers.GetTickersData.ResponseBody> =>
    axios.get(`${endpoint}/tickers/data/${params.hash}`).then(handleResponse),

  derivatives: (
    endpoint: string,
    query: Partial<Tickers.GetTickersDerivatives.RequestQuery>
  ): Promise<Tickers.GetTickersDerivatives.ResponseBody> =>
    axios
      .get(`${endpoint}/tickers/derivatives?${queryString.stringify(query)}`)
      .then(handleResponse)
}

export const trades = {
  allAddress: (
    endpoint: string,
    authAddress: string,
    signature: string
  ): Promise<Trade.GetAllTradesByAddress.ResponseBody> =>
    axios
      .get(`${endpoint}/trades/all/address?authAddress=${authAddress}`, {
        headers: {
          Authorization: `Bearer ${signature}`
        }
      })
      .then(handleResponse)
}

export const orders = {
  allAddresses: (
    endpoint: string,
    authAddress: string,
    signature: string
  ): Promise<Orders.GetAllOrdersByAddress.ResponseBody> =>
    axios
      .get(`${endpoint}/orders/all/address?authAddress=${authAddress}`, {
        headers: {
          Authorization: `Bearer ${signature}`
        }
      })
      .then(handleResponse)
}
