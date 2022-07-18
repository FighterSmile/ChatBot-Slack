const {get,reply,getMenu,getStep_x,getStep_x_x} = require('./steps');


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
    const data = await getMenu(message)
    return data
  } else if(regExp_1.test(lastStep)){
    const data = await getStep_x(lastStep, message)
    return data
  } else if(regExp_2.test(lastStep)){
    const data = await getStep_x_x(lastStep,message)
    return data
  }
}

module.exports = {getStep, responseMessages,getStepAfter}