const fs = require('fs');
const date = new Date().toISOString();

const saveMessage = (step, message, channel) =>{
  let messages = [];
  let newMessage = {
    step,
    message,
    channel,
    date
  };
  messages.push(newMessage);
  const json_messages = JSON.stringify(messages);
  fs.writeFileSync(`chats/${channel}.json`, json_messages, 'utf-8') 
}

const readLastStep = (channel) => new Promise((resolve,reject) =>{
  const pathMessages = `${__dirname}/../chats/${channel}.json`
  if(fs.existsSync(pathMessages)){
    const json_messages = fs.readFileSync(pathMessages);
    let messages = JSON.parse(json_messages);
    resolve(messages[0].step)
  }else{
    resolve(null)
  }
})

module.exports = {saveMessage, readLastStep}