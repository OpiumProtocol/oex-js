/* eslint-disable @typescript-eslint/no-namespace */
import * as sigUtil from 'eth-sig-util'

// EIP712
interface IMessageTypeProperty {
  name: string
  type: string
}

export interface IMessageTypes {
  EIP712Domain: IMessageTypeProperty[]
  [additionalProperties: string]: IMessageTypeProperty[]
}

export type EIP712Message = sigUtil.TypedMessage<IMessageTypes>

/**
 * Type of `Order` action
 */
export enum ORDER_ACTION {
  /**
   * `ASK` also referred as `Sell` order
   */
  ASK = 'ASK',
  /**
   * `BID` also referred as `Buy` order
   */
  BID = 'BID'
}

/**
 * `Ticker` is the main entity which defines the derivative
 */
export type Ticker = {
  /**
   * Maturity of derivative in UNIX timestamp
   */
  endTime: number | string
  /**
   * Margin parameter for `syntheticId`
   */
  margin: number | string
  /**
   * Address of smart contract which implements `Opium.IOracleId` interface
   */
  oracleId: string
  /**
   * Address of smart contract which implements `Opium.IDerivativeLogic` interface
   */
  syntheticId: string
  /**
   * Address of ERC20 token which is used as margin (collateral)
   */
  token: string
  /**
   * Array of parameters for `syntheticId`
   */
  params: string[]
}

/**
 * Types of `Orderbook` resource related endpoints
 */
export namespace Orderbook {
  /**
   * Types of `PostOrderbookForm` request
   */
  export namespace PostOrderbookForm {
    /**
     * Type of `PostOrderbookForm` request body
     *
     * Object representing requirement of client to obtain certain position in the market when and if it matches
     */
    export type RequestBody = {
      /**
       * Type of the `Order` action
       */
      action: ORDER_ACTION
      /**
       * Price (premium) of the order per 1 contract
       */
      price: number
      /**
       * Hash of the `Ticker` to define `Orderbook`
       */
      ticker: string
      /**
       * Quantity of contracts to buy / sell
       */
      quantity: number
      /**
       * Expiration of the `Order` in the `Orderbook` in UNIX timestamp
       *
       * Set to `0` for GTC (Good Till Cancel) order i.e. order never expires
       */
      expiresAt: number
      /**
       * Address of ERC20 token used for premium to define `Orderbook`
       */
      currency: string
    }

    /**
     * Type of `PostOrderbookForm` response body
     *
     * Array of orders required to be signed in order to obtain requested position in the market when and if it matches
     *
     * Signature of the `orderToSign` EIP712 message and `id` is required for finalization of position obtaining request
     */
    export type ResponseBody = Array<{
      /**
       * Order in the representation of EIP712 Typed Data message required to be signed for further smart contract validation and settlement
       */
      orderToSign: {
        types: {
          EIP712Domain: Array<{
            name: string
            type: string
          }>
          Order: Array<{
            name: string
            type: string
          }>
        }
        primaryType: string
        domain: {
          name: string
          version: string
          verifyingContract: string
        }
        message: {
          makerMarginAddress: string
          takerMarginAddress: string
          makerAddress: string
          takerAddress: string
          senderAddress: string
          relayerAddress: string
          affiliateAddress: string
          feeTokenAddress: string
          makerTokenId: string
          makerTokenAmount: string
          makerMarginAmount: string
          takerTokenId: string
          takerTokenAmount: string
          takerMarginAmount: string
          relayerFee: string
          affiliateFee: string
          nonce: string
          expiresAt: string
        }
      }
      /**
       * Identifier of `orderToSign` required to be sent alongside with order signature
       */
      id: string
    }>
  }

  /**
   * Types of `PostOrderbook` request
   */
  export namespace PostOrderbook {
    /**
     * Type of `PostOrderbook` request body
     *
     * Array of orders signatures with their identifiers
     */
    export type RequestBody = Array<{
      /**
       * `Order` identifier
       */
      id: string
      /**
       * EIP712 `Order` message signature in hexadecimal format  starting with `0x`
       */
      signature: string
    }>
  }

  /**
   * Types of `PutOrderbookCancel` request
   */
  export namespace PutOrderbookCancel {
    /**
     * Type of `PutOrderbookCancel` query parameters
     */
    export type RequestQuery = {
      /**
       * Array of order identifiers required to cancel
       */
      ids: string[]
    }
  }

  /**
   * Types of `GetOrderbookPreSubmit` request
   */
  export namespace GetOrderbookPreSubmit {
    /**
     * Type of `GetOrderbookPreSubmit` query parameters
     *
     * Data representing requirement of client to obtain certain position in the market when and if it matches
     */
    export type RequestQuery = {
      /**
       * Ethereum address of requester required for authentication
       */
      authAddress: string
      /**
       * Hash of the `Ticker` to define `Orderbook`
       */
      ticker: string
      /**
       * Type of the `Order` action
       */
      action: string
      /**
       * Address of ERC20 token used for premium to define `Orderbook`
       */
      quantity: number
    }

    /**
     * Type of `GetOrderbookPreSubmit` response body
     *
     * Object with the pre-calculation of the required actions to be done in order to fulfill client's requirements
     */
    export type ResponseBody = {
      /**
       * Section describing positions and margin that client would receive
       */
      receive: {
        /**
         * Amount of new positions client would receive
         *
         * LONG / SHORT position depends on `Order.action`
         */
        position: number
        /**
         * Amount of margin client would receive from reselling it's positions on 2ry market
         */
        margin: string
      }
      /**
       * Section describing positions, margin and fees that client would pay
       */
      pay: {
        /**
         * Amount of positions that client would sell on 2ry market
         */
        position: number
        /**
         * Amount of margin that client would lock for creating new positions
         */
        margin: string
        /**
         * Amount of fees that client would pay for orders settlement
         */
        fee: string
      }
    }
  }
}

/**
 * Types of `Meta` resource related endpoints
 */
export namespace Meta {
  /**
   * Types of `GetMetaConfig` request
   */
  export namespace GetMetaConfig {
    /**
     * Type of `GetMetaConfig` response body
     *
     * Object representing server configuration
     */
    export type ResponseBody = {
      /**
       * Current Ethereum network Id for the API
       */
      networkId: number
      /**
       * Default values for UI
       */
      defaults: {
        /**
         * Default `Ticker` hash
         */
        ticker: string
        /**
         * Default candle size for derivative and asset charts
         */
        candleSize: string
      }
      /**
       * List of supported ERC20 tokens
       */
      supportedTokens: {
        /**
         * ERC20 Token name
         */
        title: string
        /**
         * ERC20 Token address
         */
        address: string
        /**
         * ERC20 Token decimals
         */
        decimals: number
      }
      /**
       * Names and addresses of Opium smart contracts on current Ethereum network
       */
      opiumContracts: {
        /**
         * Address of `Opium.TokenSpender` smart contract
         */
        TokenMinter: string
        /**
         * Address of `Opium.Match` smart contract
         */
        Match: string
      }
    }
  }

  /**
   * Types for `GetMetaTickersSearchParams` request
   */
  export namespace GetMetaTickersSearchParams {
    /**
     * Type of `GetMetaTickersSearchParams` query parameters
     */
    export type RequestQuery = {
      /**
       * `Ticker.type`
       */
      type: string
    }

    /**
     * Type of `GetMetaTickersSearchParams` response body
     *
     * Object with all possible `Ticker.margin`, `Ticker.endTime` and `Ticker.params`
     *
     * This object is useful for advanced search by tickers, which is not implemented yet
     */
    export type ResponseBody = {
      margin: string[]
      endTime: string[]
      param: string[]
    }
  }
}

/**
 * Types of `Trade` resource related endpoints
 */
export namespace Trade {
  /**
   * Types of `GetAllTradesByAddress` request
   */
  export namespace GetAllTradesByAddress {
    /**
     * Type of `GetAllTradesByAddress` query parameters
     */
    export type RequestQuery = {
      /**
       * Ethereum address of requester required for authentication
       */
      authAddress: string
    }

    /**
     * Type of `GetAllTradesByAddress` response body
     *
     * Object with history of trades and swaps trades (spread trades) made by client
     */
    export type ResponseBody = {
      /**
       * Array of trades
       */
      trades: Array<{
        /**
         * `Ticker.productTitle`
         */
        productTitle: string
        /**
         * UNIX timestamp of trade creation
         */
        timestamp: number
        /**
         * `Order.action`
         */
        action: ORDER_ACTION
        /**
         * Price at which settlement ocurred
         */
        price: number
        /**
         * Quantity of positions settled within a trade
         */
        quantity: number
        /**
         * Ethereum network transaction hash of trade's settlement
         */
        txHash: number
      }>
      /**
       * Array of swaps trades (spread trades)
       */
      swapTrades: Array<{
        /**
         * UNIX timestamp of swap creation
         */
        timestamp: number
        /**
         * `tokenId` that was paid in spread trading by "left" order
         */
        leftMakerTokenId: string
        /**
         * Amount of `tokenId`s that was paid in spread trading by "left" order
         */
        leftMakerTokenAmount: number
        /**
         * Address of ERC20 token that was paid in spread trading by "left" order
         */
        leftMakerMarginAddress: string
        /**
         * Amount of ERC20 tokens that was paid in spread trading by "left" order
         */
        leftMakerMarginAmount: number
        /**
         * `tokenId` that was paid in spread trading by "right" order
         */
        rightMakerTokenId: string
        /**
         * Amount of `tokenId`s that was paid in spread trading by "right" order
         */
        rightMakerTokenAmount: number
        /**
         * Address of ERC20 token that was paid in spread trading by "right" order
         */
        rightMakerMarginAddress: string
        /**
         * Amount of ERC20 tokens that was paid in spread trading by "right" order
         */
        rightMakerMarginAmount: number
      }>
    }
  }
}

/**
 * Types of `Orders` resource related endpoints
 */
export namespace Orders {
  /**
   * Types of `GetAllOrdersByAddress` request
   */
  export namespace GetAllOrdersByAddress {
    /**
     * Type of `GetAllOrdersByAddress` query parameters
     */
    export type RequestQuery = {
      /**
       * Ethereum address of requester required for authentication
       */
      authAddress: string
    }

    /**
     * Type of `GetAllOrdersByAddress` response body
     *
     * Object with active orders and swaps (spread trade orders) made by client
     */
    export type ResponseBody = {
      orders: Array<{
        /**
         * Identifier of order
         */
        id: string
        /**
         * `Ticker.productTitle`
         */
        productTitle: string
        /**
         * UNIX timestamp of order creation
         */
        createdAt: number
        /**
         * UNIX timestamp of order expiration
         *
         * `0` for GTC (Good Till Cancel) order i.e. order never expires
         */
        expiresAt: number
        /**
         * `Order.action`
         */
        action: ORDER_ACTION
        /**
         * `Order.price`
         */
        price: number
        /**
         * `Order.quantity`
         */
        quantity: number
        /**
         * Amount of positions already filled in the order
         */
        filled: number
        /**
         * Flag indicating whether order is matching (client has enough collateral for settlement)
         */
        matching: boolean
      }>
      swaps: Array<{
        /**
         * Identifier of swap
         */
        id: string
        /**
         * UNIX timestamp of swap creation
         */
        timestamp: number
        /**
         * `tokenId` that client is willing to pay in spread trading
         */
        makerTokenId: string
        /**
         * Amount `tokenId`s that client is willing to pay in spread trading
         */
        makerTokenAmount: number
        /**
         * Address of ERC20 token that client is willing to pay in spread trading
         */
        makerMarginAddress: string
        /**
         * Amount of ERC20 tokens that client is willing to pay in spread trading
         */
        makerMarginAmount: number
        /**
         * `tokenId` that client is willing to receive in spread trading
         */
        takerTokenId: string
        /**
         * Amount `tokenId`s that client is willing to receive in spread trading
         */
        takerTokenAmount: number
        /**
         * Address of ERC20 token that client is willing to receive in spread trading
         */
        takerMarginAddress: string
        /**
         * Amount of ERC20 tokens that client is willing to receive in spread trading
         */
        takerMarginAmount: number
      }>
    }
  }
}

/**
 * Types of `Wallet` resource related endpoints
 */
export namespace Wallet {
  /**
   * Types of `GetWalletBalanceTokens` request
   */
  export namespace GetWalletBalanceTokens {
    /**
     * Type of `GetWalletBalanceTokens` response body
     *
     * Array of ERC20 tokens supported by Opium Exchange with additional client related data
     */
    export type ResponseBody = Array<{
      /**
       * ERC20 token name
       */
      title: string
      /**
       * ERC20 token address
       */
      address: string
      /**
       * ERC20 token decimals
       */
      decimals: number
      /**
       * Client's balance
       */
      total: string
      /**
       * Client's allowance to `Opium.TokenSpender`
       */
      allowance: string
    }>
  }
}
/**
 * Types of `Tickers` resource related endpoints
 */
export namespace Tickers {
  /**
   * Types of `GetTickers` request
   */
  export namespace GetTickers {
    /**
     * Type of `GetTickers` query parameters
     */
    export type RequestQuery = {
      /**
       * Filter tickers by `endTime`
       */
      endTime?: string
      /**
       * Filter tickers by `margin`
       */
      margin?: string
      /**
       * Filter tickers by `params`
       */
      param?: string
      /**
       * Filter tickers by `subtype`
       */
      subtype?: string
      /**
       * Filter tickers by `type`
       */
      type?: string
      /**
       * Filter tickers by `searchText` full text search
       */
      searchText?: string
      /**
       * Filter expired tickers
       */
      expired?: boolean
    }

    /**
     * Type of `GetTickers` response body
     */
    export type ResponseBody = Array<{
      /**
       * Ticker hash
       */
      hash: string
      /**
       * Ticker title
       */
      productTitle: string
      /**
       * @deprecated
       */
      executable: boolean
      /**
       * Whether ticker is expired (tradable)
       */
      expired: boolean
    }>
  }

  /**
   * Types of `GetTickersData` request
   */
  export namespace GetTickersData {
    /**
     * Type of `GetTickersData` query parameters
     */
    export type RequestParams = {
      /**
       * Ticker hash
       */
      hash: string
    }

    /**
     * Type of `GetTickersData` response body
     */
    export type ResponseBody = Array<{
      /**
       * Ticker hash
       */
      hash: string
      /**
       * Ticker `longTokenId`
       */
      longTokenId: string
      /**
       * Ticker `shortTokenId`
       */
      shortTokenId: string
      /**
       * Ticker `margin`
       */
      margin: string
      /**
       * Ticker `endTime`
       */
      endTime: string
      /**
       * Ticker `params`
       */
      params: Array<string>
      /**
       * Ticker `oracleId`
       */
      oracleId: string
      /**
       * Ticker `token`
       */
      token: string
      /**
       * Ticker `syntheticId`
       */
      syntheticId: string
      /**
       * Ticker `type`
       */
      type: string
      /**
       * Ticker `subType`
       */
      subType: string
      /**
       * Ticker `productTitle`
       */
      productTitle: string
      /**
       * Ticker is executable
       */
      executable: boolean
      /**
       * Ticker has data
       */
      hasData: boolean
      /**
       * Metadata for `Ticker.syntheticId`
       */
      syntheticMetadata: { [key: string]: any }
      /**
       * Metadata for `Ticker.oracleId`
       */
      oracleIdMetadata: { [key: string]: any }
      /**
       * Cached `syntheticId` data
       */
      synthetic: {
        /**
         * Buyer margin per position
         */
        buyerMargin: string
        /**
         * Seller margin per position
         */
        sellerMargin: string
      }
      /**
       * Ticker short and long descriptions
       */
      description: {
        short: string
        long: string
      }
    }>
  }

  /**
   * Types of `GetTickersDerivatives` request
   */
  export namespace GetTickersDerivatives {
    /**
     * Type of `GetTickersDerivatives` query parameters
     */
    export type RequestQuery = {
      /**
       * Array of `tokenId`s
       */
      tokenIds: string[]
    }

    /**
     * Type of `GetTickersDerivatives` response body
     *
     * Array of `Tickers` related to requested `tokenId`s
     */
    export type ResponseBody = Array<{
      /**
       * Ticker margin
       */
      margin: string
      /**
       * Ticker endTime
       */
      endTime: string
      /**
       * Ticker params
       */
      params: Array<string>
      /**
       * Ticker oracleId
       */
      oracleId: string
      /**
       * Ticker token
       */
      token: string
      /**
       * Ticker syntheticId
       */
      syntheticId: string
    }>
  }
}
