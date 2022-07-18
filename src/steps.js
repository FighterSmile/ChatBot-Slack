const stepsInitial = require('../flow/initial.json');
const stepsReponse = require('../flow/response.json');


const get =  async (message) => {
  const response = await getStep(stepsInitial, message)
  return response
};

const getMenu = async (msg) =>{
  const nextStep = require(`../flow/MENU.json`);
  const response = await getNextStep(nextStep, msg)
  return response
}

const getStep_x = async (lastStep, msg) =>{
  const nextStep = require(`../flow/step_x/${lastStep}.json`);
  const response = await getNextStep(nextStep, msg)
  return response
}

const getStep_x_x = async (lastStep, msg) => {
  const nextStep = require(`../flow/step_x_x/${lastStep}.json`);
  const response = await getNextStep(nextStep, msg)
  return response
}

const reply = (step) => new Promise((resolve, reject) =>{
  try{
    let resData = {replyMessage: '', media:null, trigger:null}
    const responseFind = stepsReponse[step] || {};
    resData = {
      ...resData,
      ...responseFind,
      replyMessage:responseFind.replyMessage.join('')}
      resolve(resData)
      return
  } catch{
    resolve(null)
  }
})

const getStep =(nextStep, msg) => new Promise((resolve, reject) => {
  for(i=0;nextStep.length >i ; i++){
    const {key} = nextStep.find( k => {
      let isMatch = msg.includes(k.keywords[i])
      if(isMatch) return isMatch
    }) || {key:null}
    const response = key || null
    if(response) return resolve(response)
  }
  resolve(null)
})

const getNextStep = (nextStep, msg) => new Promise((resolve,reject) => {
  const {key} = nextStep.find(k => k.keywords.includes(msg)) || {key:null}
  const response = key || null
  resolve(response)
})

module.exports = {get, reply, getMenu, getStep_x, getStep_x_x}