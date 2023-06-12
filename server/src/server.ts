import fastify from 'fastify'
import cors from '@fastify/cors'
import WebPush from 'web-push'
import { z } from 'zod'

const app = fastify()
app.register(cors)

const { privateKey, publicKey } = {
  publicKey:
    'BEGKbAfq5iUjPaLwoGTgOeUNJgYolvoErLI3i_zvTk0JXFhFXc25y_0lcpvdapweOXHRWMsj7qOseZuL6nGRThw',
  privateKey: 'FW5QHYlNX6Z5miZOAr9xgpa4-_mMExYqbLNSA_-p3_0',
}

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

app.get('/push/public-key', async () => {
  return {
    publicKey,
  }
})

app.post('/push/register', async (request, reply) => {
  console.log(request.body)

  return reply.status(201).send()
})

app.post('/push/send', async (request, reply) => {
  const { subscription } = z
    .object({
      subscription: z.object({
        endpoint: z.string(),
        expirationTime: z.date().nullable(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    })
    .parse(request.body)

  WebPush.sendNotification(subscription, 'Salve')

  return reply.status(201).send()
})

app
  .listen({
    host: '127.0.0.1',
    port: 3333,
  })
  .then((uri) => {
    console.log('Server running on', uri)
  })
