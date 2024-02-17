#import modules
from telegram.ext import Updater, MessageHandler, Filters
from telegram import Update
from openai import OpenAI
from moviepy.editor import AudioFileClip
from elevenlabslib import ElevenLabsUser

#define API keys
TOGETHER_API_KEY = "29e5fa35b999a845ea50daaa50dd7a91f636011d9e111c40671d29495c41cf9d"
TELEGRAM_API_TOKEN = "6514589295:AAFrIOK8uKzkMSdkc9tiMrK_ooU9-IziudU"
ELEVENLABS_API_KEY = "6e40489fa4e04e9e30786211e407ecce"

#set elevenlabs voice user
user = ElevenLabsUser(ELEVENLABS_API_KEY)
# This is a list because multiple voices can have the same name
voice = user.get_voices_by_name("Rachel")[0]

#use together.ai api
client = OpenAI(api_key=TOGETHER_API_KEY,
  base_url='https://api.together.xyz',
)

messages = []

#Create healthcare chatbot with together.ai api calls
def text_message(update, context):
    messages.append({"role": "user", "content": update.message.text})
    chat_completion = client.chat.completions.create(
      messages=[
        {
          "role": "system",
          "content": "You are an AI assistant providing the user with a summary of their electronic health record. You are not a physician or a person of authority. You are given this information about the patient: "+user_ehr,
        },
        {
          "role": "user",
          "content": "Create a summary-style report for this patient that describes this patient's current health condition with the aim of educating the patient about their health. Format the report using bullet points and concise language for increased readability. At the end of the report, include a section of recommendations for actions the patient should take, but emphasize that the patient should communicate with their physician. Title the report 'Current Health Report for [patient]' replacing [patient] with the Patient's first and last name.",
        }
      ],
      model="codellama/CodeLlama-13b-Instruct-hf",
      max_tokens=1024
    )
    response_text = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": response_text})
    response_byte_audio = voice.generate_audio_bytes(response_text)
    with open('response_elevenlabs.mp3', 'wb') as f:
        f.write(response_byte_audio)
    context.bot.send_voice(chat_id=update.message.chat.id,
                           voice=open('response_elevenlabs.mp3', 'rb'))
    update.message.reply_text(
        text=f"*[Bot]:* {response_text}", parse_mode=telegram.ParseMode.MARKDOWN)

#Create telegram chat interrface with elevenlabs voice response
def voice_message(update, context):
    update.message.reply_text(
        "I've received a voice message! Please give me a second to respond :)")
    voice_file = context.bot.getFile(update.message.voice.file_id)
    voice_file.download("voice_message.ogg")
    audio_clip = AudioFileClip("voice_message.ogg")
    audio_clip.write_audiofile("voice_message.mp3")
    audio_file = open("voice_message.mp3", "rb")
    transcript = client.Audio.transcribe("whisper-1", audio_file).text
    update.message.reply_text(
        text=f"*[You]:* _{transcript}_", parse_mode=telegram.ParseMode.MARKDOWN)
    messages.append({"role": "user", "content": transcript})
    response = client.ChatCompletion.create(
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages=messages
    )
    response_text = response["choices"][0]["message"]["content"]
    response_byte_audio = voice.generate_audio_bytes(response_text)
    with open('response_elevenlabs.mp3', 'wb') as f:
        f.write(response_byte_audio)
    context.bot.send_voice(chat_id=update.message.chat.id,
                           voice=open('response_elevenlabs.mp3', 'rb'))
    update.message.reply_text(
        text=f"*[Bot]:* {response_text}", parse_mode=telegram.ParseMode.MARKDOWN)
    messages.append({"role": "assistant", "content": response_text})


updater = Updater(TELEGRAM_API_TOKEN, use_context=True)

# Access the dispatcher directly from the updater object
dispatcher = updater.dispatcher

# Register message handlers
dispatcher.add_handler(MessageHandler(
    Filters.text & (~Filters.command), text_message))
dispatcher.add_handler(MessageHandler(Filters.voice, voice_message))

# Start the Bot
updater.start_polling()

# Run the bot until you press Ctrl-C
updater.idle()



print(chat_completion.choices[0].message.content)
