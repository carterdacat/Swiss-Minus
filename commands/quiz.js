const q1 = new Discord.RichEmbed()
  .setTitle('Quiz for SwissPlus')
  .setDescription('Reply with Numbers instead of text to detect the answer.')
  .addField('Question 1', 'Why are there spirals in the Turbines?')
  .addField('Option 1.', 'Ground Safety')
  .addField('Option 2.', 'Killing Birds')
  .setFooter('Developed by WoozyDragon4018#8134')
if (command === 'quiz'){
    message.channel.send(q1);
    const correct = new discord.RichEmbed()
      .setColor('#00ff00')
      .setTitle('Correct Answer!')
      .setDescription('The answer you said was completely correct!')

    const incorrect = new discord.RichEmbed()
      .setColor('#ff0000')
      .setTitle('Incorrect Answer!')
      .setDesctiption('Sorry but the answer you sent was incorrect. Better luck next time mate!')

    const noexist = new discord.RichEmbed()
      .setColor('#ff0000')
      .setTitle('Bad Argument.')
      .setDescription('This option number doesn\'t exist. Please try again by entering numbers.')

    const filter = m => m.content.includes('discord');
    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60 });
    console.log(collector)
    collector.on('collect', message => {
        if (message.content == "1") {
          message.channel.send(correct)
        }
        else if (message.content == "2") {
          message.channel.send(incorrect)
        }
        else {
          message.channel.send(noexist)
        }
    });
}
