import { Client } from '@azoom/test-http-server'
import app from '~/app'

const client = new Client(app)

export default client
