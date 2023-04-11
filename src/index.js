import {
  Client,
  GatewayIntentBits,
  Routes,
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { REST } from "@discordjs/rest";
import * as dotenv from "dotenv";
dotenv.config();

const token = process.env.TOKEN;
const clientid = process.env.CLIENTID;
const guildid = process.env.GUILDID;

const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Some title")
  .setURL("https://discord.js.org/")
  .setAuthor({
    name: "Some name",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  })
  .setDescription("Some description here")
  .setThumbnail("https://i.imgur.com/AfFp7pu.png")
  .addFields(
    { name: "Regular field title", value: "Some value here" },
    { name: "\u200B", value: "\u200B" },
    { name: "Inline field title", value: "Some value here", inline: true },
    { name: "Inline field title", value: "Some value here", inline: true }
  )
  .addFields({
    name: "Inline field title",
    value: "Some value here",
    inline: true,
  })
  .setImage("https://i.imgur.com/AfFp7pu.png")
  .setTimestamp()
  .setFooter({
    text: "Some footer text here",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
  });

// specify what permissions the client needs
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: 10 }).setToken(token);

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in !`);
  //   channel.send({ embeds: [exampleEmbed] });
});

// this is the event that listens for any interaction , and you can filter commands and do things accordingly
client.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log(interaction.options);
    interaction.reply({ content: "This interaction is a chat input command" });

    // check every possibility
    if (interaction.commandName == "button") {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("primary")
          .setLabel("Click this button to see magic")
          .setStyle(ButtonStyle.Success)
      );
      interaction.reply({ content: "I think you should.", components: [row] });
    } else if (interaction.commandName === "ping") {
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("select")
          .setPlaceholder("Nothing selected")
          .addOptions(
            {
              label: "Select me",
              description: "This is a description",
              value: "first_option",
            },
            {
              label: "You can select me too",
              description: "This is also a description",
              value: "second_option",
            }
          )
      );

      interaction.reply({ content: "Pong!", components: [row] });
    }else if(interaction.commandName == "modalities"){
        const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal');

            const favoriteColorInput = new TextInputBuilder()
			.setCustomId('favoriteColorInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your favorite color?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('hobbiesInput')
			.setLabel("What's some of your favorite hobbies?")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

            interaction.showModal(modal);
    }
    // if number 2 end
  } else {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error("No command matching " + interaction.commandName);
    }
  }
});

async function main() {
  const commands = [
    {
      name: "ping",
      description: "Replies with pong!",
    },
    {
      name: "tutorialhelp",
      description: "Help tutorial",
    },
    {
      name: "order",
      description: "order something...",
      options: [
        {
          name: "food",
          description: "you want to order food",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "button",
      description: "You have entered a button command",
    },
    {
        name: "modalities",
        description: "Modalities of life"
    }
  ];

  try {
    console.log("Started refreshing application (/) commands.");
    Routes.application;
    // tell the disscord api to register these commands in the discord server
    await rest.put(Routes.applicationGuildCommands(clientid, guildid), {
      body: commands,
    });
    client.login(token);
  } catch (e) {
    console.error(e);
  }
}

main();