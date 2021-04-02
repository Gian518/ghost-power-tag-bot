/*
************************************************************************************
************************************************************************************
********** COD BOT - A simple Telegram bot which saves custom user tags ************
***************************** Created by @Gian518 **********************************
************************************************************************************
*/

require('dotenv').config()

var TelegramBot = require('node-telegram-bot-api')
var fs = require('fs')
var tags = require('./tags.json')

var token = process.env.TELEGRAM_TOKEN
var bot = new TelegramBot(token, { polling: true })

// Start the bot
bot.onText(/\/start/, (msg, match) => {
    let chatID = msg.chat.id
    try {
        let response = "Ciao! CODBot ti consente di salvare il tuo tag e mostrarlo agli altri giocatori. I comandi sono:\n/tag <iltuotag> - Aggiunge il tuo tag alla collezione\n/user <nickname> - Mostra il tag di un utente\n/comandi - Mostra questo messaggio\n\nBot creato da @Gian518"
        bot.sendMessage(chatID, response)
    } catch (error) {
        let response = "Si è verificagto un errore."
        console.log("Error:", error)
        bot.sendMessage(chatID, response)
    }
})

// Same as /start
bot.onText(/\/comandi/, (msg, match) => {
    let chatID = msg.chat.id
    try {
        let response = "Ciao! CODBot ti consente di salvare il tuo tag e mostrarlo agli altri giocatori. I comandi sono:\n/tag <iltuotag> - Aggiunge il tuo tag alla collezione\n/user <nickname> - Mostra il tag di un utente\n/comandi - Mostra questo messaggio\n\nBot creato da @Gian518"
        bot.sendMessage(chatID, response)
    } catch (error) {
        let response = "Si è verificagto un errore."
        console.log("Error:", error)
        bot.sendMessage(chatID, response)
    }
})

// Return the searched tag
bot.onText(/\/user (.+)/, (msg, match) => {
    let chatId = msg.chat.id
    try {
        let user = match[1].replaceAll('@', '')
        let tag = tags[user.toLowerCase()]
        let response = ''
        if(tag){
            response = "Il tag di @" + match[1] + ' è: #' + tag
        } else {
            response = 'Utente non trovato!'
        }
        bot.sendMessage(chatId, response)
    } catch (error) {
        bot.sendMessage(chatId, 'Si è verificato un errore, riprova.')
    }
})

// Write the tag on JSON file
bot.onText(/\/tag (.+)/, (msg, match) => {
    let chatId = msg.chat.id
    try {
        let user = msg.chat.username
        let tag = match[1].replaceAll('#', '')
        console.log("Tag:", tag)
        tags[user.toLowerCase()] = tag
        fs.writeFile('./tags.json', JSON.stringify(tags), err => {
            console.log("Done!", err)
            let response = ''
            if(err){
                console.log("Error in /tag:", err)
                response = 'Sì è verificato un errore. Riprova!'
                bot.sendMessage(chatId, response)
            } else {
                response = 'Tag salvato!'
                bot.sendMessage(chatId, response)
            }
        })
    } catch (error) {
        bot.sendMessage(chatId, 'Si è verificato un errore, riprova.')
    }
})