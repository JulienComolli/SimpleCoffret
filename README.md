# SimpleCoffret


Small project to pratice programming in **JavaScript** using the environnement **NodeJS**, the **MongoDb** database and the libraries : [DiscordJs](https://discord.js.org/), [node-cache](https://www.npmjs.com/package/node-cache) and [Mongoose](https://mongoosejs.com/).

To do this project is inspired by the [GuideBot](https://github.com/AnIdiotsGuide/guidebot/) template, you should check it out if you want to make discord bots it's amazing.


- [The Bot](#thebot)
- [Commands](#commands)
- [Invite](#)


<br/>


<a  name="thebot"/></a>

## The Bot


This bot is a simple one. Each day you can open a **coffret** wich contains some loots. The loots are simple : *Diamonds*, *Emerald*, *Ruby* and *Topaz*. With those gems you can either keep them to become rich or use them to buy today's special meal for you or your friends.

**A player need to have claimed its first coffret to be recognized by the bot.**
<br/><br/>

### The player

For each player the bot handle an inventory and some stats. Both can be seen by checking the [profile](#profile) of the player.

#### Inventory

All those items can be stored by the players : **Coffret**, **Diamonds**, **Emerald**, **Ruby** and **Topaz**.

#### Stats
| Stats                  | Description                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Inventory Value        | Total value of the inventory                                                         |
| Meals Eaten            | Number of meal eaten by the player                                                   |
| Meals Gifted           | Number of meal gifted by the player                                                  |
| Money spent            | Value of all the loots spent to gift meals                                           |
| Coffrets opened        | Number of coffret opened                                                             |



### Today's special meal

The **today's special meal** is a meal that change each day. It is generated randomly and can be bought for yourself or gifted to other players.
Beware ! You can eat a maximum of **3** meals per day, you don't wanna get an indigestion don't you ?

### Loots


| Loots      | Value |
| -----------| ------|
| Diamonds   | 10    |
| Emerald    | 7     |
| Ruby       | 5     |
| Topaz      | 3     |


<a  name="commands"/></a>

## Commands

- [Claiming coffrets](#claiming)
- [Opening coffrets](#opening)
- [Getting today's special meal](#tsm)
- [Info about today's speciak meal](#tsminfo)
- [Checking player profile](#profile)
- [Seeing server ranks](#ranks)
- [Bot infos and help](#infos)


<a  name="claiming"/></a>

### Claiming the Coffret

You can ongly get **one** coffret per day but you can keep it in your inventory without opening it.
You can get a new coffret each day a **12pm UTC**.

- **sc$coffret**

<a  name="opening"/></a>

#### Open the Coffret

After claiming a coffret you can open it to get its loot. You can use the command as long as you have coffret in your inventory.

- **sc$open**

<a  name="tsm"/></a>

### Offering a friend the today's special meal

Each day the today's special meal change. You can either buy one for you or gift one for your friend. You can buy yourself a meal **only** once a day.

- **sc$buytsm** *<@player>*


<a name="tsminfo"></a>

### Infos about the today's special meal

To see what is the meal of the day !

- **sc$todaymeal** or **$sc$tsm**

<a name="profile"></a>

### Checking a player profile

- **sc$profile** *<@player>*

<a name="ranks"></a>

### Server ranks

You can check the ranks of the player who play with the bot on the server where you use that command. You need to specify

- **sc$ranks** *<rich, ate, gifted, spent, opened>*


<a name="infos"></a>

### Bot infos and help

To display the bot presentation and some additional infos.

- **sc$infos**

To get help with the commands.

- **sc$help** <command_name>