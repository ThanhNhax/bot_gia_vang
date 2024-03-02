const http = require('node:http')
require('dotenv').config()
const hostname = '127.0.0.1'
const TelegramBot = require('node-telegram-bot-api')
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TOKEN_BOT
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
  if (msg.text === '/gia_vang') {
    const res = await fetch('https://www.mihong.vn/api/v1/gold/prices/current')
    const data = await res.json()
    const tableData = [
      ['Loại Vàng ', ' Giá Mua\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t', ' Giá Bán']
    ]
    const bodyData = []

    const bodyTable = data.data.filter((item) =>
      ['SJC', '999', '680'].includes(item.code)
    )
    bodyTable.map((item) =>
      bodyData.push([
        item.code,
        item.sellingPrice.toLocaleString('vi-VN'),
        item.buyingPrice.toLocaleString('vi-VN')
      ])
    )
    const tabkeMarkdown = tableData.map((row) => row.join('\t| ')).join('\n')
    const bodyMarkdown = bodyData
      .map((row) => row.join('\t\t\t\t\t\t\t\t\t\t\t\t\t\t' + ' | '))
      .join('\n')

    bot.sendMessage(chatId, tabkeMarkdown + '\n' + bodyMarkdown)
  } else {
    bot.sendMessage(chatId, 'Error')
  }
})
const port = 3000
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
