let prefix = "!"
const util = require('util')
const fs = require('fs')
const portable = {
    admins: [],
    categories: ["Info", "No category"],
    addAdmin: (id) => {
        if(typeof id !== "string" || id.length !== 18) throw new Error("Wrong Discord Snowflake")
        portable.admins.push(id)
    },
    remAdmin: (id) => {
        if(typeof id !== "string" || id.length !== 18) throw new Error("Wrong Discord Snowflake")
        let s = portable.admins
        portable.admins = []
        for(i of s) {
            if(i !== id) portable.admins.push(i)
        }
        return admins
    },
    prefix: prefix,
    filename: "prefixes",
    prefixes: {enabled: false},
    enablePrefixes: () => {
        portable.prefixes.enabled = true
        portable.prefixes.all = JSON.parse(fs.readFileSync(`${portable.filename}.json`))
    },
    commands: {},
    adminMessage: "You must be the admin of the bot in order to execute this command.",
    errorMessage: "Caught an error!\nDo not worry, I have sent the error to my developer. Expect this error to be fixed in a short time.",
    nsfwMessage: "This command can only be executed in an NSFW channel!",
    cooldownMessage: "This command is on cooldown.",
    changePrefix: (newprefix) => {
        prefix = newprefix
        portable.prefix = newprefix
    },
    setUserPrefix: (id, prefix) => {
        portable.prefixes.all[id] = prefix
        fs.writeFileSync(`${portable.filename}.json`, JSON.stringify(portable.prefixes.all))
    },
    resetUserPrefix: (id) => {
        delete portable.prefixes.all[id]
        fs.writeFileSync(`${portable.filename}.json`, JSON.stringify(portable.prefixes.all))
    },
    exampleCommands: {
        help: {
            description: "Get help about commands and categories.",
            usage: `help`,
            admin: false,
            nsfw: false,
            category: "Info",
            execute: async (msg, args, author, client) => {
                if(!args[0]) {
                    let commands = []
                    for(i of Object.keys(portable.commands)) {
                        if(!portable.admins.includes(author.id) && portable.commands[i].admin !== true) commands.push(i)
                    }
                    msg.channel.send(`===HELP===\nCategories: ${portable.categories.join(", ")}\nCommands: ${commands.join(", ")}`, {code: true})
                } else {
                    if(Object.keys(portable.commands).includes(args[0])) {
                        msg.channel.send(`===HELP===\nCommand: ${args[0]}\nDescription: ${portable.commands[args[0]].description}\nUsage: ${portable.commands[args[0]].usage}`, {code: true})
                    } else if(portable.categories.includes(args.join(" "))) {
                        let categoryCommands = []
                        for(i=0;i<Object.keys(portable.commands).length;i++) {
                            if(portable.commands[Object.keys(portable.commands)[i]].category === args.join(" ")) categoryCommands.push(Object.keys(portable.commands)[i])
                        }
                        msg.channel.send(`===HELP===\nCategory: ${args.join(" ")}\nCommands: ${categoryCommands.join(", ")}`, {code: true})
                    } else {
                        msg.channel.send(`No category or command was found with this name.`)
                    }
                }
            }
        },
        ping: {
            description: "Ping the bot.",
            usage: `ping`,
            admin: false,
            nsfw: false,
            /* cooldown: {
                time: 10000,
                worksFor: {

                }
            }, */
            //Example of rate limit in 10s
            category: "Info",
            execute: async (msg, args, author, client) => {
                msg.channel.send(`:ping_pong: Pong!\nLatency: ${Math.round(client.ping)} ms`)
            }
        },
        eval: {
            description: "Evaluate JavaScript code.",
            usage: `eval <code>`,
            admin: true,
            nsfw: false,
            category: "Manager",
            execute: async(msg, args, author, client) => {
                let commands = portable.commands
                let bot = portable.client
                let message = msg
                let channel = msg.channel
                let instance = portable
                msg.react("▶️").then(async _$ => {
                    try {
                        if(args.join(" ").startsWith("```js")) args = args.join(" ").split("").slice(5, args.join(" ").length-4).join("").split(" ")
                        let evaled = await eval(args.join(" "))
                        if(util.inspect(evaled, {depth: 0, maxArrayLength: 50}).length > 1992) {
                            console.log(util.inspect(evaled, {depth: 0, maxArrayLength: 50}))
                            msg.react('✅').then(msg.channel.send(`Output was too long. Check the console for output.`))
                        }
                    if(util.inspect(evaled, {depth: 0, maxArrayLength: 50}).length < 1) {
                        msg.react('‼')
                        return msg.channel.send(`DiscordAPIError: Cannot send an empty message`, {code: "js"}).catch(() => {})
                    }
                    msg.react("✅")
                    msg.channel.send(util.inspect(evaled, {depth: 0, maxArrayLength: 50}).replace(client.token, "[token omitted]").replace(util.inspect(Array.from(client.token), {depth: 0, maxArrayLength: 50}), "['[', 't', 'o', 'k', 'e', 'n', ' ', 'o', 'm', 'i', 't', 't', 'e', 'd', ']']"), {code: "js"})
                } catch (err) {
                    msg.react('‼')
                    msg.channel.send(err.stack, {code: "js"}).catch(() => {})
                }
            })
            }
        }
    },
    loadExamples: () => {
        for(i=0;i<Object.keys(portable.exampleCommands).length;i++) {
            portable.commands[Object.keys(portable.exampleCommands)[i]] = portable.exampleCommands[Object.keys(portable.exampleCommands)[i]]
        }
    },
    Command: (options) => {
        if(!options.name || !options.description || !options.usage || !options.execute) throw new Error("Not enough arguments provided")
        if(!portable.categories.includes(options.category ? options.category : "No category")) throw new Error("No such category, call categories to see available categories")
        portable.commands[options.name] = options
    },
    handler: (client, options) => {
        /**
         * default options = {
         *  bots: false,
         *  dm: false
         * }
         */
            client.on('message', msg => {
                let command = msg.content.slice(!portable.prefixes.enabled || !portable.prefixes.all[msg.author.id] ? portable.prefix.length : portable.prefixes.all[msg.author.id].length).split(" ").shift().toLowerCase()
                if(!options) options = {bots: false, dm: false}
                if(msg.author.bot && !options.bots) return
                if(msg.channel.type === "dm" && !options.dm) return
                if(Object.keys(portable.commands).includes(command) && msg.content.startsWith(!portable.prefixes.enabled || !portable.prefixes.all[msg.author.id] ? portable.prefix : portable.prefixes.all[msg.author.id])) {
                    if(portable.commands[command].admin && !portable.admins.includes(msg.author.id)) {
                        if(!portable.adminMessage || typeof portable.adminMessage !== "string") return
                        else return msg.channel.send(portable.adminMessage)
                    }
                    if(portable.commands[command].nsfw && !msg.channel.nsfw) {
                        if(!portable.nsfwMessage || typeof portable.nsfwMessage !== "string") return
                        else return msg.channel.send(portable.nsfwMessage)
                    }
                    if(portable.commands[command].cooldown && portable.commands[command].cooldown.worksFor[msg.author.id] === true && !portable.admins.includes(msg.author.id)) {
                        return msg.channel.send(portable.сooldownMessage).catch(() => {msg.channel.send("You are on cooldown!")})
                    }
                    try {
                        portable.commands[command].execute(msg, msg.content.split(" ").slice(1), msg.author, client)
                        if(portable.commands[command].cooldown) {
                            portable.commands[command].cooldown.worksFor[msg.author.id] = true
                            setTimeout(() => {portable.commands[command].cooldown.worksFor[msg.author.id] = false}, portable.commands[command].cooldown.time)
                        }
                    } catch(error) {
                        if(!portable.errorMessage) msg.channel.send("[PLACEHOLDER] Catched an error")
                        msg.channel.send(portable.errorMessage)
                        console.log(error)
                        for(i of this.admins) {
                            client.users.get(i).send(error, {code: "js"})
                        }
                    }
                }
            })
    },
    handleredit: (client, options) => {
        client.on('messageUpdate', (_oldmsg, msg) => {
            let command = msg.content.slice(!portable.prefixes.enabled || !portable.prefixes.all[msg.author.id] ? portable.prefix.length : portable.prefixes.all[msg.author.id].length).split(" ").shift().toLowerCase()
            if(!options) options = {bots: false, dm: false}
            if(msg.author.bot && !options.bots) return
            if(msg.channel.type === "dm" && !options.dm) return
            if(Object.keys(portable.commands).includes(command) && msg.content.startsWith(!portable.prefixes.enabled || !portable.prefixes.all[msg.author.id] ? portable.prefix : portable.prefixes.all[msg.author.id])) {
                if(portable.commands[command].admin && !portable.admins.includes(msg.author.id)) {
                    if(!portable.adminMessage || typeof portable.adminMessage !== "string") return
                    else return msg.channel.send(portable.adminMessage)
                }
                if(portable.commands[command].nsfw && !msg.channel.nsfw) {
                    if(!portable.nsfwMessage || typeof portable.adminMessage !== "string") return
                    else return msg.channel.send(portable.nsfwMessage)
                }
                try {
                    portable.commands[command].execute(msg, msg.content.split(" ").slice(1), msg.author, client).catch(() => {
                        if(!portable.errorMessage) msg.channel.send("[PLACEHOLDER] Catched an error")
                        msg.channel.send(portable.errorMessage)
                        console.log(error)
                        for(i of portable.admins) {
                            client.users.get(i).send(error, {code: "js"})
                        } 
                    })
                } catch(error) {
                    if(!portable.errorMessage) msg.channel.send("[PLACEHOLDER] Catched an error")
                    msg.channel.send(portable.errorMessage)
                    console.log(error)
                    for(i of portable.admins) {
                        client.users.get(i).send(error, {code: "js"})
                    }
                }
            }
        })
    }
}
module.exports = portable
