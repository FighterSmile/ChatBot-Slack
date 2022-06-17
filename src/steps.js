const stepsInitial = require('../flow/initial.json');
const stepsReponse = require('../flow/response.json');

const get = (message) => new Promise((resolve, reject) => {
  let msgs = message.split(' ');
  for (i=0; msgs.length >i;i++){
    for (e=0; stepsInitial.length > e; e++){
      const {key} = stepsInitial.find( k => {
        if( msgs[i] === k.keywords[e]){
          return msgs[i] === k.keywords[e]
        }
      }) || {key: null};
      const response = key || null
      if(response){
        resolve(response);
      }
    }
  };
  resolve(null)
});

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