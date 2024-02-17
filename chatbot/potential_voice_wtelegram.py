
from telegram.ext import Updater, MessageHandler, Filters
import telegram
import openai
from moviepy.editor import AudioFileClip
from elevenlabslib import *



TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")
TELEGRAM_API_TOKEN = "<YOUR_TELEGRAM_BOT_TOKEN>"
ELEVENLABS_API_KEY = "<YOUR_ELEVENLABS_API_KEY>"

user = ElevenLabsUser(ELEVENLABS_API_KEY)
# This is a list because multiple voices can have the same name
voice = user.get_voices_by_name("Rachel")[0]

client = OpenAI(api_key=TOGETHER_API_KEY,
  base_url='https://api.together.xyz',
)

messages = []

def text_message(update, context):
    messages.append({"role": "user", "content": update.message.text})
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant",
            },
            {
                "role": "user",
                "content": update.message.text,
            }
        ],
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
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
dispatcher = updater.dispatcher
dispatcher.add_handler(MessageHandler(
    Filters.text & (~Filters.command), text_message))
dispatcher.add_handler(MessageHandler(Filters.voice, voice_message))
updater.start_polling()
updater.idle()
