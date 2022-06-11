const {get,reply} = require('./steps')

const getStep = async(message) =>{
  const msg = await get(message)
  return msg
}


const responseMessages = async (step) =>{
  const data = await reply(step)
  return data
}

module.exports = {getStep, responseMessages}