import chai from 'chai'
// Communication interface
import { Api } from '../../src/index'
// Utils
import { signMessage } from '../../src/Utils/signature'
// Types
import { ORDER_ACTION, Tickers, Orderbook } from '../../src/Utils/types'
// Constants
import { userCredentials } from '../../src/constants/userCredentials'

const assert = chai.assert

describe('OEX tests', () => {
  const api = new Api()
  let tickersList: Tickers.GetTickers.ResponseBody
  let selectedTickerData: Tickers.GetTickersData.ResponseBody
  const selectedIndex = 0

  after(async () => {
    api.socketShutdown()
  })

  describe('OEX API', () => {
    describe('orderbook login', () => {
      it('Login', async () => {
        try {
          const loginData = await api.getAuthLoginData()
          api.signature = signMessage({
            data: loginData,
            privateKey: userCredentials.privateKey
          })
          api.authAddress = userCredentials.publicKey
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })
    })

    describe('/tickers', () => {
      it('/tickers GET all', async () => {
        const tickersGetAllQuery = {
          type: 'swap'
        }
        try {
          tickersList = await api.tickersGetAll(tickersGetAllQuery)
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })

      it('/tickers GET data', async () => {
        const getTickersDataQuery = tickersList[selectedIndex].hash
        try {
          selectedTickerData = await api.tickersGetData(getTickersDataQuery)
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })

      it('/tickers GET derivatives', async () => {
        const getDerivativesQuery = {
          tokenIds: ['']
        }
        try {
          await api.tickersGetDerivatives(getDerivativesQuery)
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })
    })

    describe('/orderbook', () => {
      let orderbookFormResponse: Orderbook.PostOrderbookForm.ResponseBody

      it('/formOrder POST should return 201 status code', async () => {
        const postOrderbookFormRequestBody = {
          action: ORDER_ACTION.BID,
          price: 1,
          ticker: tickersList[selectedIndex].hash,
          quantity: 1,
          expiresAt: 0,
          currency: selectedTickerData[selectedIndex].token
        }
        try {
          orderbookFormResponse = await api.postOrderForm(
            postOrderbookFormRequestBody
          )
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })

      it('/orders POST ORDER SIGN should return 201 status code', async () => {
        const signature = signMessage({
          data:
            orderbookFormResponse[orderbookFormResponse.length - 1].orderToSign,
          privateKey: userCredentials.privateKey
        })
        const postOrderbookRequestBody = [
          {
            id: orderbookFormResponse[orderbookFormResponse.length - 1].id,
            signature
          }
        ]
        try {
          await api.postOrderSign(postOrderbookRequestBody)
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })

      it('/cancel PUT should return 202', async () => {
        const putOrderbookCancelQuery = {
          ids: [orderbookFormResponse[orderbookFormResponse.length - 1].id]
        }
        try {
          await api.putOrdersCancel(putOrderbookCancelQuery)
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })

      it('/getOrderPresubmit GET should return 200 status code', async () => {
        const getOrderbookPreSubmitRequestQuery = {
          authAddress: userCredentials.publicKey,
          ticker: tickersList[selectedIndex].hash,
          action: ORDER_ACTION.BID,
          quantity: 1
        }
        try {
          await api.getOrderPreSubmit(getOrderbookPreSubmitRequestQuery)
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })
    })

    describe('/trades', () => {
      it('/trades GET all trades', async () => {
        try {
          await api.tradesGetAllTradesByAddress()
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })
    })

    describe('/meta', () => {
      it('/config GET', async () => {
        try {
          await api.metaConfig()
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })

      it('/tickers/searchParams GET', async () => {
        try {
          await api.metaTickersSearch({ type: 'synthetic' })
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })
    })

    describe('/orders', () => {
      it('/orders GET all addresses', async () => {
        try {
          await api.ordersGetAllOrdersByAddress()
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })
    })

    describe('/wallet', () => {
      it('/wallet/balance/', async () => {
        try {
          await api.walletTokenBalance()
        } catch (err) {
          assert.fail(err.response.status, 'Request failed')
        }
      })
    })
  })

  describe('OEX socket tests', () => {
    const socket = api

    it('chart:asset', done => {
      socket.onError(err => {
        assert.equal(err, undefined)
        socket.unsubscribeOnChartsAsset({
          o: selectedTickerData[selectedIndex].oracleId,
          s: '1$min'
        })
        done()
      })
      socket.onChartsAsset(msg => {
        assert(msg !== undefined)
        socket.unsubscribeOnChartsAsset({
          o: selectedTickerData[selectedIndex].oracleId,
          s: '1$min'
        })
        done()
      })
      socket.subscribeOnChartsAsset({
        o: selectedTickerData[selectedIndex].oracleId,
        s: '1$min'
      })
    })

    it('chart:deriv', done => {
      socket.onError(err => {
        assert.equal(err, undefined)
        socket.unsubscribeOnChartsDeriv({
          t: tickersList[selectedIndex].hash,
          s: '1$min',
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.onChartsDeriv(msg => {
        assert(msg !== undefined)
        socket.unsubscribeOnChartsDeriv({
          t: tickersList[selectedIndex].hash,
          s: '1$min',
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.subscribeOnChartsDeriv({
        t: tickersList[selectedIndex].hash,
        s: '1$min',
        c: selectedTickerData[selectedIndex].token
      })
    })

    it('orderbook:orders:ticker', done => {
      socket.onError(err => {
        assert.equal(err, undefined)
        socket.unsubscribeOnOrderbookOrdersTicker({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.onOrderbookOrdersTicker(msg => {
        assert(msg !== undefined)
        socket.unsubscribeOnOrderbookOrdersTicker({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.subscribeOnOrderbookOrdersTicker({
        t: tickersList[selectedIndex].hash,
        c: selectedTickerData[selectedIndex].token
      })
    })

    it('orderbook:orders:makerAddress', done => {
      socket.onError(err => {
        assert.equal(err, undefined)
        socket.unsubscribeOnOrderbookOrdersMakerAddress({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.onOrderbookOrdersMakerAddress(msg => {
        assert(msg !== undefined)
        socket.unsubscribeOnOrderbookOrdersMakerAddress({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.subscribeOnOrderbookOrdersMakerAddress({
        t: tickersList[selectedIndex].hash,
        c: selectedTickerData[selectedIndex].token
      })
    })

    it('positions:address', done => {
      socket.onError(err => {
        assert.equal(err, undefined)
        socket.unsubscribePositions()
        done()
      })
      socket.onPositions(msg => {
        assert(msg !== undefined)
        socket.unsubscribePositions()
        done()
      })
      socket.subscribePositions()
    })

    it('trades:ticker:all', done => {
      socket.onError(err => {
        assert.equal(err, undefined)
        socket.unsubscribeOnTradesTickerAll({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.onTradesTickerAll(msg => {
        assert(msg !== undefined)
        socket.unsubscribeOnTradesTickerAll({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.subscribeOnTradesTickerAll({
        t: tickersList[selectedIndex].hash,
        c: selectedTickerData[selectedIndex].token
      })
    })

    it('trades:ticker:address', done => {
      socket.onError(err => {
        assert.equal(err, undefined)
        socket.unsubscribeOnTradesTickerAddress({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.onTradesTickerAddress(msg => {
        assert(msg !== undefined)
        socket.unsubscribeOnTradesTickerAddress({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.subscribeOnTradesTickerAddress({
        t: tickersList[selectedIndex].hash,
        c: selectedTickerData[selectedIndex].token
      })
    })

    it('derivative:stats', done => {
      socket.onError(err => {
        assert.equal(err, undefined)
        socket.unsubscribeOnDerivativeStats({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.onDerivativeStats(msg => {
        assert(msg !== undefined)
        socket.unsubscribeOnDerivativeStats({
          t: tickersList[selectedIndex].hash,
          c: selectedTickerData[selectedIndex].token
        })
        done()
      })
      socket.subscribeOnDerivativeStats({
        t: tickersList[selectedIndex].hash,
        c: selectedTickerData[selectedIndex].token
      })
    })
  })
})
