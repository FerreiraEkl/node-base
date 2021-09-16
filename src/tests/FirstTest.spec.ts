import { User } from '@schemas/user.schema'

test('Test your mind', () => {
  const user = new User()

  user.userName = 'Jhon doe'

  expect(user.userName).toEqual('Jhon doe')
})
