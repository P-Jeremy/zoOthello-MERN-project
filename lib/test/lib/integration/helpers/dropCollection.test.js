const User = require('../../../../db/models/User')
const bcrypt = require('bcryptjs')
const NewUser = require('../../../../domain/models/NewUser')
const { expect } = require('chai')
const { catchErr, dropCollection } = require('../../../test-helpers')

describe('Integration | Helpers | dropCollection', async function () {
  it('Should delete a collection', async function () {
    // given
    const user = new NewUser({
      email: 'userDroptest@example.net',
      pseudo: 'UserDropTest',
      password: 'KnownUser123!'
    })

    const user2 = new NewUser({
      email: 'userDroptest2@example.net',
      pseudo: 'UserDropTest2',
      password: 'KnownUser123!'
    })

    const user3 = new NewUser({
      email: 'userDroptest3@example.net',
      pseudo: 'UserDropTest3',
      password: 'KnownUser123!'
    })

    const registeredUser1 = new User({
      pseudo: user.pseudo,
      email: user.email,
      password: await bcrypt.hash(user.password, 10)
    })

    const registeredUser2 = new User({
      pseudo: user2.pseudo,
      email: user2.email,
      password: await bcrypt.hash(user2.password, 10)
    })

    const registeredUser3 = new User({
      pseudo: user3.pseudo,
      email: user3.email,
      password: await bcrypt.hash(user3.password, 10)
    })

    await registeredUser1.save()
    await registeredUser2.save()
    await registeredUser3.save()

    // when
    const result = await dropCollection(User)

    // then
    expect(result).to.deep.equal({ n: 3, ok: 1, deletedCount: 3 })
  })

  it('Should throw if there is no collection to drop', async function () {
    const UnexistingCollection = Symbol('*')

    // when
    const result = await catchErr(dropCollection)(UnexistingCollection)

    // then
    expect(result).to.be.instanceOf(Error)
  })
})
