const stepsInitial = require('../flow/initial.json');
const stepsReponse = require('../flow/response.json');


const get = (message) => new Promise((resolve,reject)  => {
  for(i=0; stepsInitial.length > i; i++){
    const {key} = stepsInitial.find( k =>{
      let isMatch = message.includes(k.keywords[i])
      if(isMatch) return isMatch
    }) || {key:null}
    const response = key || null
    if(response) return resolve(response)
  }
  resolve(null)
}) ;

const getMenu = (msg) => new Promise((resolve, reject) =>{
  const nextStep = require(`../flow/MENU.json`);
  for(i=0;nextStep.length > i; i++){
    const {key} = nextStep.find( k=>{
      let isMatch = msg.includes(k.keywords[i])
      if(isMatch) return isMatch
    }) || {key:null}
    const response = key || key
    if(response) return resolve(response)
  }
  resolve(null)
})

const getStep_x = (lastStep, msg) => new Promise((resolve, reject) =>{
  const nextStep = require(`../flow/step_x/${lastStep}.json`);
  for(i=0;nextStep.length > i; i++){
    const {key} = nextStep.find( k=>{
      let isMatch = msg.includes(k.keywords[i])
      if(isMatch) return isMatch
    }) || {key:null}
    const response = key || key
    if(response) return resolve(response)
  }
  resolve(null)
})

const getStep_x_x = (lastStep, msg) => new Promise((resolve, reject) => {
  const nextStep = require(`../flow/step_x_x/${lastStep}.json`);
  for(i=0; nextStep.length > i ; i++){
    const {key} = nextStep.find( k=>{
      let isMatch = msg.includes(k.keywords[i])
      if (isMatch) return isMatch
    }) || {key:null}
    const response = key || null
    if(response) return resolve(response)
  }
  resolve(null)
})

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


module.exports = {get, reply, getMenu, getStep_x, getStep_x_x}