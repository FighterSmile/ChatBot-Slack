const fs = require('fs');
const date = new Date().toISOString();

const saveMessage = (step, message, userid) =>{
  let messages = [];
  let newMessage = {
    step,
    message,
    userid,
    date
  };
  messages.push(newMessage);
  const json_messages = JSON.stringify(messages);
  fs.writeFileSync(`chats/${userid}.json`, json_messages, 'utf-8') 
}

const readLastStep = (userid) => new Promise((resolve,reject) =>{
  const pathMessages = `${__dirname}/../chats/${userid}.json`
  if(fs.existsSync(pathMessages)){
    const json_messages = fs.readFileSync(pathMessages);
    let messages = JSON.parse(json_messages);
    resolve(messages[0].step)
  }else{
    resolve(null)
  }
})

module.exports = {saveMessage, readLastStep}