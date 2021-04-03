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

let welcomeText = "Ciao! GhostPowerTag ti consente di salvare il tuo tag e mostrarlo agli altri giocatori. I comandi sono:\n/tag `<iltuotag>` - Aggiunge il tuo tag alla collezione o modifica quello esistente\n/user `<nickname>` - Mostra il tag di un utente\n/all - Mostra tutti i tag\n/me - Mostra il tuo tag\n/commands - Mostra questo messaggio\n\nBot creato da @Gian518"

// Start the bot with a welcome message, it does the same with /commands
bot.onText(/\/start|\/commands/, (msg, match) => {
    let chatID = msg.chat.id
    try {
        let response = welcomeText
        bot.sendMessage(chatID, response, { parse_mode: 'Markdown' })
    } catch (error) {
        let response = "Si è verificagto un errore."
        console.log("Error:", error)
        bot.sendMessage(chatID, response)
    }
})

// Return the searched user tag
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
                tags = require('./tags.json')
            }
        })
    } catch (error) {
        bot.sendMessage(chatId, 'Si è verificato un errore, riprova.')
    }
})

// Show all tags
bot.onText(/\/all/, (msg, match) => {
    let chatId = msg.chat.id
    try {
        let response = ""
        if(Object.entries(tags).length > 0){
            response = "Ecco tutti i tag:"
            Object.entries(tags).forEach(tag => {
                response += "\n@" + tag[0] + ": #" + tag[1]
            })
        } else {
            response = "Non ci sono ancora tag. Riprova più tardi!"
        }
        bot.sendMessage(chatId, response)
    } catch (error) {
        let response = 'Si è verificato un errore. Riprova.'
        console.log("Error in /all: ", error)
        bot.sendMessage(chatId, response)
    }
})

// Show user tag
bot.onText(/\/me/, (msg, match) => {
    let chatId = msg.chat.id
    try {
        let response = ''
        let tag = tags[msg.chat.username.toLowerCase()]
        if(tag){
            response = 'Il tuo tag è #' + tag + '\nPuoi reimpostarlo con il comando /tag `<iltuotag>`'
        } else {
            response = 'Non hai ancora salvato il tuo tag. Invialo con il comando /tag `<iltuotag>`'
        }
        bot.sendMessage(chatId, response, { parse_mode: 'Markdown' })
    } catch (error) {
        console.log("Error in /me", error)
        let response = "Si è verificato un errore. Riprova."
        bot.sendMessage(chatId, response)
    }
})