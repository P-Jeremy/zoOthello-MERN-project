
function catchErr (promiseFn, ctx) {
  return async (...args) => {
    try {
      await promiseFn.call(ctx, ...args)
      return 'should have thrown an error'
    } catch (err) {
      return err
    }
  }
}

async function dropCollection (Model) {
  try {
    const result = await Model.find({}).deleteMany()
    return result
  } catch (error) {
    if (error) {
      throw Error()
    }
  }
}

module.exports = {
  catchErr,
  dropCollection
}
