# better-commando
Constantly innovating to be better than official Commando

## Installing
First, you should download the index.js out of this page.

Then, you import the library in your bot file with:
```javascript
const bettercmd = require("./index.js")
```

## Setting up your bot
Now, keep in mind that I will call Discord.Client instance "client" in my code, so don't just copy and paste if client is named differently.

First, you should consider adding this into your code:
```javascript
bettercmd.client = client
```
This will port the client instance to the commands system so commands using the client instance can work properly.
Secondly, you <b>must</b> add the handler or bot will not respond to messages. Also, you want to put the handler last in your code.
Here's how you add a handler:
```typescript
bettercmd.handler(client)
//or you can customize the handler:
bettercmd.handler(client, {
  bots: boolean, //whether bots can use commands or not
  dm: boolean //whether users can use your bot in DMs or not
})
```
(both bots and dm are false by default)

You can also add the edit handler to handle message editing.
```typescript
bettercmd.handleredit(client)
//or you can customize the handler, just like the main handler:
bettercmd.handleredit(client, {
  bots: boolean, //whether bots can use commands or not
  dm: boolean //whether users can use your bot in DMs or not
})
```
## Adding commands
To start, you can load the 3 example commands by using the function `bettercmd.loadExamples()`. It will load the help, ping and eval commands.

To directly access the 3 example commands, use `bettercmd.exampleCommands`. It's an object with 3 commands you can use to get better understanding of how commands are structured.

If you start the bot now and try to use any commands, you may or may not guess the prefix. It's `!`. But what if you want to change it? There is a solution. Just use the `bettercmd.changePrefix(newprefix)` in order to change the prefix. Because of the special prefix system, you can't directly change it from `bettercmd.prefix` or it will break.

At this point, you probably are thinking "How do I add more commands?". It's actually simple.

You should use this example to add commands:
```javascript
bettercmd.Command({name: "test", description: "A test", usage: "Test", category: "No category", admin: false, execute: async(msg, args, author, client) => {
  author.send("test")
  msg.react(":white_check_mark:")
}
})
```
You maybe noticed the admin property. If right now you try to change it to true, the bot will send you the message about how you can't use this command. That's because you haven't added yourself to the admins array. Here's how you do it: `bettercmd.addAdmin(id)`.

To make the command only available in NSFW channels, set nsfw in options to true.

If you made a mistake, you can always remove the mistake from admins: `bettercmd.remAdmin(id)`.

You can see who's admin by accessing `bettercmd.admins`.

Also, if you didn't like the message it gave you when you weren't an admin, you can change it by accessing `bettercmd.adminMessage`. The same goes for `bettercmd.errorMessage` which will be sent when you have an error in your execute function and `bettercmd.nsfwMessage` which will be sent if a NSFW command is executed in non-NSFW channel.
New messages were added in v1.1 - `botNoPermMessage` and `userNoPermMessage`, which are self-explanatory. 

To access all the commands you have right now, use `bettercmd.commands`.

To access the prefix, use `bettercmd.prefix`.
## Custom prefixes
To set the prefix for a user:
1) Skip steps 2-5 if you have set up the custom prefixes already
2) Create a file in the folder with your bot with any name, however extension must be .json
4) Set `bettercmd.filename` to the name of your file, minus the JSON extension.
5) Enable prefixes by using the `bettercmd.enablePrefixes()` function
6) Use `bettercmd.setUserPrefix(id, prefix)` to set the prefix

You can also reset the prefix with `bettercmd.resetUserPrefix(id)`

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

## Requiring permissions
If you are making a moderation command, adding your own tests isn't very convenient. But you may not do that now, because of the property `permissions` you can assign to your commands. It's just an array of permissions. It will both check if the bot and if the user have required permission(s). Use `botNoPermMessage` and `userNoPermMessage` to customize messages when bot/user doesn't have required permissions.

## Aliases
Want to have one or several aliases for your command? Simple, just assign the property aliases to the command! Aliases must be an array containing all the aliases that the command can use.

## Emulating commands
To emulate commands, use `bettercmd.emulate(content, channel)`. But you have to provide a real Discord channel, as it just emits the message event.

## Export to !eval
While you were using the !eval command, you probably have noticed that variables come from the library file, not your bot file(s). To fix that, just set `bettercmd.evalExport` to whatever you want to export to the !eval command. It can be accessed in the !eval command as _exports.
