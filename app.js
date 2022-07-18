const dotenv = require('dotenv');
dotenv.config();
const packageJson = require('./package.json')

import { RTMClient } from '@slack/rtm-api';
const {getStep, responseMessages,getStepAfter} = require('./src/flow')
const {saveMessage, readLastStep} = require('./src/save')
const {formatting,sendMessage} = require('./src/handle')

//environment variables
const SLACK_OAUTH_TOKEN = process.env.SLACK_OAUTH_TOKEN;
const DEFAULT_MESSAGE = process.env.DEFAULT_MESSAGE;
const ID_CHANNEL = process.env.ID_CHANNEL;

const rtm = new RTMClient(SLACK_OAUTH_TOKEN)

// start the bot
rtm.start()
  .catch(console.error)

rtm.on('ready', async ()=>{
  console.log('bot started')
})

//listen to messages
const listenMessage = () => rtm.on('message', async (msg) =>{
  if(msg.type !== 'message' || msg.subtype === 'bot_message' || !msg.text || msg.channel === ID_CHANNEL || msg.files) return;

  let message = msg.text.toLowerCase()
  const channel = msg.channel
  const userid = msg.user 

  // formatting text
  message = await formatting(message)

  // reply according to the keyword
  let step = await getStep(message);

  // Find Previous Step
  let lastStep = await readLastStep(userid)

  // Check if previous step exists 
  if(lastStep && step != 'WELCOME' && lastStep != step) {
    const regExp = /STEP_[1-9]$/;
    const regExp_2 = /STEP_[1-9]_[1-9]$/;

    // Messages MENU and STEP_X and STEP_X_X
    if(lastStep == 'MENU' || regExp.test(lastStep) || regExp_2.test(lastStep)){
      step = await getStepAfter(lastStep, message)
      const response = await responseMessages(step)
      if(response){
        saveMessage(step,message,userid)
        await sendMessage(channel, response.replyMessage)
        return
      }
    }

    // Message Default
    step = await getStep(message);
    if(regExp.test(lastStep) || regExp_2.test(lastStep) || lastStep === 'MENU'){
      if(!step ){
        const response = await responseMessages(lastStep)
        const defaultMessage = await responseMessages('DEFAULT_STEP')
        if(response){
          saveMessage(lastStep,message,userid)
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