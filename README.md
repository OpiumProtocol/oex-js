# OEX JS SDK

This npm module implements the HTTP and Socket.io API of https://trade.opium.exchange/

## Installation

```
npm i @opiumteam/oex-js
```

## Examples

### Get products list

```
import { Api } from '@opiumteam/oex-js'

const api = new Api()

api
  .tickersGetAll()
  .then(tickers => console.log(tickers))
```

## Development

Clone project and install dev dependencies

```
npm i
```

Run TS build, linter and docs

```
npm run build
npm run lint
npm run docs
```

Submit pull requests