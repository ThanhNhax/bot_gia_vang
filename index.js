const http = require('node:http')
const { token_bot } = require('./utils/token')
require('dotenv').config()
const hostname = '127.0.0.1'
const port = 3000
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(token_bot, { polling: true })

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
