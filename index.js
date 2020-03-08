let prefix = "!"
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
    commands: {},
    adminMessage: "You must be the admin of the bot in order to execute this command.",
    errorMessage: "Catched an error!\nDo not worry, I have sent the error to my developer. Expect this error to be fixed in a short time.",
    changePrefix: (newprefix) => {
        prefix = newprefix
        portable.prefix = newprefix
    },
    exampleCommands: {
        help: {
            description: "Get help about commands and categories.",
            usage: `help`,
            admin: false,
            category: "Info",
            execute: async (msg, args, author, client) => {
                if(!args[0]) {
                    msg.channel.send(`===HELP===\nCategories: ${portable.categories.join(", ")}\nCommands: ${Object.keys(portable.commands).join(", ")}`, {code: true})
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
            category: "Info",
            execute: async (msg, args, author, client) => {
                let d = new Date()
                msg.channel.send(`:ping_pong: Pong!\nLatency: ${Math.round(client.ping)} ms`)
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
        portable.commands[options.name] = {
            description: options.description,
            usage: options.usage,
            admin: !!options.admin,
            category: options.category ? options.category : "No category",
            execute: options.execute
        }
    },
    handler: (client, options) => {
        /**
         * default options = {
         *  bots: false,
         *  dm: false
         * }
         */
            client.on('message', msg => {
                
                let command = msg.content.slice(portable.prefix.length).split(" ").shift().toLowerCase()
                if(!options) options = {bots: false, dm: false}
                if(msg.author.bot && !options.bots) return
                if(msg.channel.type === "dm" && !options.dm) return
                if(Object.keys(portable.commands).includes(command) && msg.content.startsWith(portable.prefix)) {
                    if(portable.commands[command].admin && !portable.admins.includes(msg.author.id)) {
                        if(!portable.adminMessage) return
                        else return msg.channel.send(portable.adminMessage)
                    }
                    try {
                        portable.commands[command].execute(msg, msg.content.split(" ").slice(1), msg.author, client)
                    } catch(error) {
                        if(!portable.errorMessage) msg.channel.send("[PLACEHOLDER]")
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
        client.on('messageUpdate', (_oldmsg, newmsg) => {
            let command = newmsg.content.slice(portable.prefix.length).split(" ").shift().toLowerCase()
            if(!options) options = {bots: false, dm: false}
            if(newmsg.author.bot && !options.bots) return
            if(newmsg.channel.type === "dm" && !options.dm) return
            if(Object.keys(portable.commands).includes(command) && newmsg.content.startsWith(portable.prefix)) {
                if(portable.commands[command].admin && !portable.admins.includes(newmsg.author.id)) {
                    if(!portable.adminMessage) return
                    else return newmsg.channel.send(portable.adminMessage)
                }
                try {
                    portable.commands[command].execute(newmsg, newmsg.content.split(" ").slice(1), newmsg.author, client)
                } catch(error) {
                    if(!portable.errorMessage) newmsg.channel.send("[PLACEHOLDER]")
                    newmsg.channel.send(portable.errorMessage)
                    console.log(error)
                    for(i of this.admins) {
                        client.users.get(i).send(error, {code: "js"})
                    }
                }
            }
        })
    }
}
module.exports = portable
