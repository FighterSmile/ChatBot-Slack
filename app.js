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
  if(msg.type !== 'message' || msg.subtype === 'bot_message' || !msg.text) return;

  let message = msg.text.toLowerCase()
  const channel = msg.channel
  const userid = msg.user

  // formatting text
  message = await formatting(message)

  // Paso anterior
  let lastStep = await readLastStep(userid)

  // reply according to the keyword
  let step = await getStep(message);

  if(lastStep && step != 'WELCOME' && lastStep != step) {
    const regExp = /STEP_[1-9]$/;
    const regExp_2 = /STEP_[1-9]_[1-9]$/;

    // Messae MENU and STEP_x
    if(lastStep == 'MENU' || regExp.test(lastStep)){
      step = await getStepAfter(lastStep, message)
      const response = await responseMessages(step)
      if(response){
        saveMessage(step,message,userid)
        await sendMessage(channel, response.replyMessage)
        return
      }
    }

    // Message STEP_x_x
    if( regExp_2.test(lastStep)){
      step = await getStepAfter(lastStep, message)
      const response = await responseMessages(step)
      if(response){
        saveMessage(step,message,userid)
        await sendMessage(channel, response.replyMessage)
        return
      }
    }

    step = await getStep(message);
    
    // Message Default
    if(regExp.test(lastStep) || regExp_2.test(lastStep) || lastStep === 'MENU'){
      if(!step ){
        step = lastStep
        const response = await responseMessages(step)
        const defaultMessage = await responseMessages('DEFAULT_STEP')
        if(response){
          saveMessage(step,message,userid)
          await sendMessage(channel, defaultMessage.replyMessage)
          await sendMessage(channel, response.replyMessage)
          return
        }
      }
    }
  };
  
  // save new messages
  saveMessage(step, message, userid);

  // reply according to the keyword
  if (step){
    let response = await responseMessages(step);
    response = response.replyMessage.replace('USER',userid)
    await sendMessage(channel, response)
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