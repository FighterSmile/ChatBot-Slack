const dotenv = require('dotenv');
dotenv.config();
const packageJson = require('./package.json')

import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
const {getStep, responseMessages,getStepAfter} = require('./src/flow')
const {saveMessage, readLastStep} = require('./src/save')
const {formatting} = require('./src/handle')

//environment variables
const SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN;
const DEFAULT_MESSAGE = process.env.DEFAULT_MESSAGE;

const rtm = new RTMClient(SLACK_OAUTH_TOKEN)
const web = new WebClient(SLACK_OAUTH_TOKEN)

// start the bot
rtm.start()
  .catch(console.error)

rtm.on('ready', async ()=>{
  console.log('bot started')
})

//listen to messages
const listenMessage = () => rtm.on('message', async (msg) =>{
  if(msg.type !== 'message' || msg.subtype == 'bot_message' || !msg.text) return;

  let message = msg.text.toLowerCase()
  const channel = msg.channel

  // formatting text
  message = await formatting(message)

  // Paso anterior
  let lastStep = await readLastStep(channel)

  // reply according to the keyword
  let step = await getStep(message);

  if(lastStep && step != 'WELCOME') {
    const regExp = /STEP_[1-9]$/;
    const regExp_2 = /STEP_[1-9]_[1-9]$/;

    if(lastStep == step){
      const response = await responseMessages(step);
      await sendMessage(channel, response.replyMessage)
      return
    }
    
    if(lastStep == 'MENU' || regExp.test(lastStep)){
      step = await getStepAfter(lastStep, message)
      const response = await responseMessages(step)
      if(response){
        saveMessage(step,message,channel)
        await sendMessage(channel, response.replyMessage)
        return
      }
    }
    
    if( regExp_2.test(lastStep)){
      step = await getStepAfter(lastStep, message)
      const response = await responseMessages(step)
      if(response){
        saveMessage(step,message,channel)
        await sendMessage(channel, response.replyMessage)
        return
      }
    }
  };

  
  // save new messages
  saveMessage(step, message, channel);
  
  // reply according to the keyword
  step = await getStep(message);

  // reply according to the keyword
  if (step){
    const response = await responseMessages(step);
    await sendMessage(channel, response.replyMessage)
    return
  }

  // Default Message
  if (DEFAULT_MESSAGE === 'true'){
    const response = await responseMessages('DEFAULT')
    await sendMessage(channel, response.replyMessage)
    return
  }
})

listenMessage()

async function sendMessage(channel, message){
  await web.chat.postMessage({
    channel: channel,
    text: message
  });
}