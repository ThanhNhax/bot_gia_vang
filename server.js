const TelegramBot = require('node-telegram-bot-api')

// replace the value below with the Telegram token you receive from @BotFather
const token = '6665724703:AAFqU_3l2AWPsE4YLxwz6CDQrqf9HMqsCYg'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id
  const resp = match[1] // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp)
})

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  let message = 'Không hợp lệ'
  if (msg.text === '/gia_vang') {
    const res = await fetch('https://www.mihong.vn/api/v1/gold/prices/current')
    const data = await res.json()
    const thead = `###\t\t\t \t\t\t Giá bán \t\t\t Giá Mua`
    const vang999 = data.data.find((item) => item.code === '999')
    message =
      thead +
      '\n' +
      `999: \t\t\t ${vang999.sellingPrice.toLocaleString(
        'vi-VN'
      )} \t\t\t ${vang999.buyingPrice.toLocaleString('vi-VN')}`
  }

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, message)
})
