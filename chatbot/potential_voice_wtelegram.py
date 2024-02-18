#import modules
import os
from telegram.ext import Updater, MessageHandler, Filters
from telegram import Update
from openai import OpenAI
from moviepy.editor import AudioFileClip
from elevenlabslib import ElevenLabsUser

#define API keys
api_key = "29e5fa35b999a845ea50daaa50dd7a91f636011d9e111c40671d29495c41cf9d"
TOGETHER_API_KEY = api_key
TELEGRAM_API_TOKEN = "6514589295:AAFrIOK8uKzkMSdkc9tiMrK_ooU9-IziudU"
ELEVENLABS_API_KEY = "6e40489fa4e04e9e30786211e407ecce"

#Automate textual tabulation of user_ehr simulated data
# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath('postgresql\output.txt'))

# Construct the path to the output.txt file relative to the script directory
output_file_path = os.path.join(script_dir, 'output.txt')

# Open the .txt file using the relative path
with open(output_file_path, 'r') as file:
    user_ehr = file.read().replace('\n', '')


#set elevenlabs voice user
user = ElevenLabsUser(ELEVENLABS_API_KEY)
# This is a list because multiple voices can have the same name
voice = user.get_voices_by_name("Rachel")[0]

#use together.ai api
client = OpenAI(api_key=TOGETHER_API_KEY,
  base_url='https://api.together.xyz',
)

messages = []

def get_summary(api_key, user_ehr):
    client = OpenAI(api_key=api_key,
        base_url='https://api.together.xyz',
    )
    update.message.reply_text(
        "I've received a text message! Please give me a second to respond :)")
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
    max_tokens=1024)

    return chat_completion.choices[0].message.content

# append question to chat history prior to calling function
def get_answer(api_key, user_summary, question):
    client = OpenAI(api_key=api_key,
        base_url='https://api.together.xyz',
    )

    if len(chat)==0:
        chat.append(
            {
                "role": "system",
                "content": "You are an AI assistant answering questions the user asks about their health, taking into consideration any questions the user previously asked. You are not a physician or a person of authority. You cannot answer any questions irrelevant to medical health such as payment information, physician information, hospital information, and healthcare providers. You are given this information about the patient: "+user_summary,
            }
        )
        chat.append(
            {
                "role": "user",
                "content": "I am this patient. Please answer this question in detail: "+question,
            }
        )
    else:
        chat.append( 
             {"role":"user", 
              "content": "I am this patient. Please answer this question in detail: "+question}
        )

    chat_completion = client.chat.completions.create(
    messages=chat,
    model="codellama/CodeLlama-13b-Instruct-hf",
    max_tokens=1024)
    chat.append(
        {"role":"assistant", "content":chat_completion.choices[0].message.content}
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

    return chat_completion.choices[0].message.content

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
    

summary = get_summary(api_key=TOGETHER_API_KEY, user_ehr=user_ehr)
print(summary)
chat = []
user_input = input("Ask me about your health conditions, or say or type 'quit' to end the conversation!\n")
while user_input != "quit":
    bot_response = get_answer(
        api_key=TOGETHER_API_KEY, 
        user_summary=summary, 
        question=user_input,
    )
    print(bot_response)
    user_input = input("Ask me about your health conditions, or type 'quit' to end the conversation!\n")
    response_text = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": response_text})
    response_byte_audio = voice.generate_audio_bytes(response_text)
    with open('response_elevenlabs.mp3', 'wb') as f:
        f.write(response_byte_audio)
    context.bot.send_voice(chat_id=update.message.chat.id,
                           voice=open('response_elevenlabs.mp3', 'rb'))
    update.message.reply_text(
        text=f"*[Bot]:* {response_text}", parse_mode=telegram.ParseMode.MARKDOWN)
    


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
