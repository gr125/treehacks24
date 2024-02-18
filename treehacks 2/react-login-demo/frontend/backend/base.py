from openai import OpenAI
user_ehr = open("../../../../postgresql/output.txt","r").read()
TOGETHER_API_KEY = "29e5fa35b999a845ea50daaa50dd7a91f636011d9e111c40671d29495c41cf9d"

def get_summary(api_key, user_ehr):
    client = OpenAI(api_key=api_key,
        base_url='https://api.together.xyz',
    )

    chat_completion = client.chat.completions.create(
    messages=[
        {
        "role": "system",
        "content": "You are an AI assistant providing the user with a summary of their electronic health record. You are not a physician or a person of authority. You are given this information about the patient: "+user_ehr,
        },
        {
        "role": "user",
        "content": "Create a summary-style report for this patient that describes this patient's current health condition with the aim of educating the patient about their health. Only include information most relevant to the patient. Format the report using bullet points and concise language for increased readability. At the end of the report, include a section of recommendations for actions the patient should take, but emphasize that the patient should communicate with their physician. Title the report 'Current Health Report for [patient]' replacing [patient] with the Patient's first and last name.",
        }
    ],
    model="codellama/CodeLlama-13b-Instruct-hf",
    max_tokens=1024)

    return chat_completion.choices[0].message.content


from flask import Flask

api = Flask(__name__)

@api.route('/profile')
def my_profile():
    summary, _= get_summary(api_key=TOGETHER_API_KEY, user_ehr=user_ehr)
    return summary;

    