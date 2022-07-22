const {get,reply, getKeyStep} = require('./steps');

const pathMenu = `${__dirname}/../flow/MENU.json`;
const pathStep_X = `${__dirname}/../flow/step_x`;
const pathStep_X_X = `${__dirname}/../flow/step_x_x`;


const getStep = async(message) =>{
  const msg = await get(message)
  return msg
}


const responseMessages = async (step) =>{
  const data = await reply(step)
  return data
}

const getStepAfter = async (lastStep, message) => {
  const regExp_1 = /STEP_[1-9]$/g;
  const regExp_2 = /STEP_[1-9]_[1-9]$/g;
  if (lastStep == 'MENU'){
    const result = await getKeyStep(pathMenu, message)
    return result
  } else if(regExp_1.test(lastStep)){
    let path = `${pathStep_X}/${lastStep}.json`
    const result = await getKeyStep(path, message)
    return result
  } else if(regExp_2.test(lastStep)){
    let path = `${pathStep_X_X}/${lastStep}.json`
    const result = await getKeyStep(path, message)
    return result
  }
}


module.exports = {getStep, responseMessages,getStepAfter}