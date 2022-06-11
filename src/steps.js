const stepsInitial = require('../flow/initial.json');
const stepsReponse = require('../flow/response.json');

const get = (message) => new Promise((resolve, reject) => {
  const { key } = stepsInitial.find(k => k.keywords.includes(message)) || {key: null}
  const response = key || null
  resolve(response)
})


const reply = (step) => new Promise((resolve, reject) =>{
  let resData = {replyMessage: '', media:null, trigger:null}
  const responseFind = stepsReponse[step] || {};
  resData = {
    ...resData,
    ...responseFind,
    replyMessage:responseFind.replyMessage.join('')}
    resolve(resData)
    return
})


module.exports = {get, reply}