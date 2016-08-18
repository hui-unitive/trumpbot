var SlackBot = require('slackbots');
var bot = new SlackBot({
    token: 'YOUR_TOKEN', // put the token
    name: 'trumpbot'
});

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream('quotes.txt')
 });

var quotes = []; 
rl.on('line', function (line) {
    quotes.push(line);
});


bot.on('start', function() {
    for(var i=0; i<this.users.length; i++){
        if(this.users[i].name == bot.name){
            this.user = this.users[i];
            break;
        }
    }
});


bot.on('message', function(data) {

    if(data.type === 'message' && data.text){
        if(data.user !== this.user.id){
            var randomInt = Math.floor(Math.random() * (quotes.length));
            bot.postMessage(data.channel, quotes[randomInt], {as_user: true});
        }
    } 
   
})