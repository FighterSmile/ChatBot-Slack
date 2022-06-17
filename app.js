const dotenv = require('dotenv');
dotenv.config();
const packageJson = require('./package.json')

import { RTMClient } from '@slack/rtm-api';
import { WebClient } from '@slack/web-api';
const {getStep, responseMessages} = require('./src/flow')


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


  // reply according to the keyword
  const step = await getStep(message);

  if (step){
    const response = await responseMessages(step);
    await sendMessage(channel, response.replyMessage)
    return
  }

  // Default Message
  if (DEFAULT_MESSAGE === 'true'){
    const response = await responseMessages('DEFAULT')
    await sendMessage(channel, response.replyMessage)
  }
})

listenMessage()


async function sendMessage(channel, message){
  await web.chat.postMessage({
    channel: channel,
    text: message
  });
}