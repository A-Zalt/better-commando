# commando-portable
A library made for Discord.js users to make command handling in one file easier

## Installing
First, you should download the index.js out of this page.

Then, you import the library in your bot file with:
```javascript
const commandoportable = require("./index.js")
```

## Setting up your bot
Now, keep in mind that I will call Discord.Client instance "client" in my code, so don't just copy and paste if client is named differently.

First, you should consider adding this into your code:
```javascript
commandoportable.client = client
```
This will port the client instance to the commands system so commands using the client instance can work properly.
Secondly, you <b>must</b> add the handler or bot will not respond to messages. Also, you want to put the handler last in your code.
Here's how you add a handler:
```typescript
commandoportable.handler(client)
//or you can customize the handler:
commandoportable.handler(client, {
  bots: boolean, //whether bots can use commands or not
  dm: boolean //whether users can use your bot in DMs or not
})
```
(both bots and dm are false by default)

You can also add the edit handler to handle message editing.
```typescript
commandoportable.handleredit(client)
//or you can customize the handler:
commandoportable.handleredit(client, {
  bots: boolean, //whether bots can use commands or not
  dm: boolean //whether users can use your bot in DMs or not
})
```
## Adding commands
To start, you can load the 3 example commands by using the function `commandoportable.loadExamples()`. It will load the help, ping and eval commands.

To directly access the 3 example commands, use `commandoportable.exampleCommands`. It's an object with 2 commands you can use to get better understanding of how commands are structured.

If you start the bot now and try to use any commands, you may or may not guess the prefix. It's `!`. But what if you want to change it? There is a solution. Just use the `commandoportable.changePrefix(newprefix)` in order to change the prefix.

At this point, you probably are thinking "How do I add more commands?". It's actually simple.

You should use this example to add commands:
```javascript
commandoportable.Command({name: "test", description: "A test", usage: "Test", category: "No category", admin: false, execute: async(msg, args, author, client) => {
  author.send("test")
  msg.react(":white_check_mark:")
}
})
```
You maybe noticed the admin property. If right now you try to change it to true, the bot will send you the message about how you can't use this command. That's because you haven't added yourself to the admins array. Here's how you do it: `commandoportable.addAdmin(id)`.

To make the command only available in NSFW channels, set nsfw in options to true.

If you made a mistake, you can always remove the mistake from admins: `commandoportable.remAdmin(id)`.

You can see who's admin by accessing `commandoportable.admins`.

Also, if you didn't like the message it gave you when you weren't an admin, you can change it by accessing `commandoportable.adminMessage`. The same goes for `commandoportable.errorMessage` which will be sent when you have an error in your execute function and `commandoportable.nsfwMessage` which will be sent if a NSFW command is executed in non-NSFW channel.

To access all the commands you have right now, use `commandoportable.commands`.

To access the prefix, use `commandoportable.prefix`.
## Custom prefixes
To set the prefix for a user:
1) Skip steps 2-5 if you have set up the custom prefixes already
2) Create a file in the folder with your bot with any name, however extension must be .json
4) Set `commandoportable.filename` to the name of your file, minus the JSON extension.
5) Enable prefixes by using the `commandoportable.enablePrefixes()` function
6) Use `commandoportable.setUserPrefix(id, prefix)` to set the prefix

You can also reset the prefix with `commandoportable.resetUserPrefix(id)`

## Cooldowns
Cooldowns are quite simple. `cooldown` is a property of a command with type object in which you must provide the `time` property (cooldown in ms) and worksFor, which is just an empty object, but is required in order for the cooldown to work.

## Example commands
help: If no arguments, shows the list of all commands and categories.
If an argument is provided, shows the following category/command.

ping: Shows the bot's latency.

eval: Evaluate JS code. Admin-only. Here are the aliases:

message - msg

bot - client instance

channel - the channel this command was called in

commands - list of available commands

## Aliases
Want to have one or several aliases for your command? Simple, just assign the property aliases to a command! Aliases must be an array containing all the aliases that the command can use.
