import { User } from '@prisma/client'
import client from '~vitest/client'
import { clearFixtures, userFactory } from '~vitest/fixtures/factories'

let user: User

beforeEach(async () => {
  user = await userFactory.create()
})

afterEach(async () => {
  await clearFixtures()
})

test('POST /auth/login', async () => {
  const res = await client.post('/auth/login')
  expect(res.status).toBe(200)
  expect(user).not.toBeNull()
})
