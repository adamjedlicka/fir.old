# Base

The `@fir-js/base` package provides most common functionality like static assets (`public` concept) or API routes (`public` routes).

## Public

Every file in the `public/` directory will be served under URL corresponding to its path in the `public/` directory. So `public/images/logo.png` will be server under `/images/logo.png` URL.

## Routes

JavaScript/TypeScript files in the `routes/` directory will be registered as a server route under the files name. These files should export default Express request handler function.

```typescript
// routes/hello.ts
import type { RequestHandler } from 'express'

const requestHandler: RequestHandler = (req, res, next) => {
  res.send('Hello, World!')
}

export default requestHandler
```

```bash
$ curl http://localhost:8080/hello
> Hello, World!
```

### Dynamic parameters

Square brackets in the file name/file path can be used to represent dynamic parameters.

```typescript
// routes/hello/[name].ts
import type { RequestHandler } from 'express'

const requestHandler: RequestHandler = (req, res, next) => {
  res.send(`Hello, ${req.params.name}!`)
}

export default requestHandler
```

```bash
$ curl http://localhost:8080/hello/Adam
> Hello, Adam!
```

### Proxy

Routes can also be used as a proxy to the actual backend.

```typescript
// routes/graphql.ts
import { createProxyMiddleware } from 'http-proxy-middleware'

export default createProxyMiddleware({
  target: 'https://venia.magento.com',
  changeOrigin: true,
})
```
