/** 
    Mongoose Schema And Methods 
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/trumpbot');

var Schema = mongoose.Schema; 
// create a schema 
var quoteSchema = new Schema({ 
    quote: String
}); 

/* Randomly select a quote from mongodb */
quoteSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};
var Quote = mongoose.model('Quote', quoteSchema);


/** 
    SlackBots Prototype
 */
var SlackBot = require('slackbots');
var bot = new SlackBot({
    token: 'YOUR_TOKEN', // put the token
    name: 'trumpbot'
});

const REGRET = "And believe it or not, I regret it. And I do regret it, particularly where it may have caused personal pain.";
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
            Quote.random(function(err, res) {
                if(err){
                    bot.postMessage(data.channel, REGRET, {as_user: true});    
                }else{
                    console.log(res)
                    bot.postMessage(data.channel, res.quote, {as_user: true});    
                }
            });
        }
    } 
})