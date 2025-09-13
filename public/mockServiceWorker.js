/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.0.14).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '223d9facd4a4c6b1a0b74fdb8155d68c'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !event.data) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data.type) {
    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(clientId, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { clientId, request, requestId } = event

  return event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (request.mode === 'cors') {
        console.error(
          `[MSW] Failed to mock a ${request.method} ${request.url} request in CORS mode: ${error.message}`,
        )
      }

      throw error
    }),
  )
})

async function handleRequest(event, requestId) {
  const client = await self.clients.get(event.clientId)

  if (!client) {
    return passthrough(event.request)
  }

  // Bypass service worker for local development
  if (event.request.url.startsWith(self.location.origin)) {
    return passthrough(event.request)
  }

  if (!activeClientIds.has(event.clientId)) {
    return passthrough(event.request)
  }

  // Clone the request because it might've been already used
  // (i.e. its body has been read and sent to the client).
  const requestClone = event.request.clone()

  function passthrough(request) {
    // Clone the request because it might've been already used
    // (i.e. its body has been read and sent to the client).
    const requestClone = request.clone()
    return fetch(requestClone)
  }

  // Notify the client that a request has been intercepted.
  const clientMessage = await sendToClient(client, {
    type: 'REQUEST',
    payload: {
      id: requestId,
      url: requestClone.url,
      method: requestClone.method,
      headers: Object.fromEntries(requestClone.headers.entries()),
      cache: requestClone.cache,
      mode: requestClone.mode,
      credentials: requestClone.credentials,
      destination: requestClone.destination,
      integrity: requestClone.integrity,
      redirect: requestClone.redirect,
      referrer: requestClone.referrer,
      referrerPolicy: requestClone.referrerPolicy,
      body: await requestClone.text(),
      bodyUsed: requestClone.bodyUsed,
      keepalive: requestClone.keepalive,
    },
  })

  switch (clientMessage.type) {
    case 'MOCK_RESPONSE': {
      return respondWithMock(clientMessage.data)
    }

    case 'MOCK_NOT_FOUND': {
      return passthrough(event.request)
    }

    case 'NETWORK_ERROR': {
      const { name, message } = clientMessage.data
      const networkError = new Error(message)
      networkError.name = name

      // Rejecting a request Promise in a ServiceWorker will
      // result in a network error response.
      throw networkError
    }
  }

  return passthrough(event.request)
}

function sendToClient(client, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    client.postMessage(
      message,
      [channel.port2]
    )
  })
}

function sleep(timeMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs)
  })
}

async function respondWithMock(response) {
  await sleep(response.delay)
  return new Response(response.body, response)
}

const coercedResponse = (response) => {
  if (response.body && typeof response.body === 'object') {
    return Object.assign(response, {
      body: JSON.stringify(response.body),
    })
  }

  return response
}

function parseJsonSafely(json) {
  try {
    return JSON.parse(json)
  } catch (error) {
    return null
  }
}