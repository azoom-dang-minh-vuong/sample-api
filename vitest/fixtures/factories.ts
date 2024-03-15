import { faker } from '@faker-js/faker/locale/ja'
import { prisma } from '~/database'
import { initialize, registerScalarFieldValueGenerator, defineUserFactory } from './fabbrica'

initialize({
  prisma,
})
// setting default data
registerScalarFieldValueGenerator({
  Boolean: () => faker.helpers.arrayElement([true, false]),
  String: ({ isId, isUnique }) => {
    if (isId || isUnique) {
      return faker.string.nanoid()
    }
    return faker.string.alphanumeric()
  },
  Decimal: () => faker.number.float({ precision: 0.001 }).toString(),
  Float: () => faker.number.float({ precision: 0.001 }),
  Json: () => faker.datatype.json(),
  Bytes: () => Buffer.from(faker.string.uuid(), 'utf8'),
  DateTime: () => faker.date.anytime(),
})

export const clearFixtures = async () => {
  await prisma.user.deleteMany()
}

export const userFactory = defineUserFactory({
  defaultData: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
})
