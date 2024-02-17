
from openai import OpenAI

user_ehr = '''
Mekhi724 Kemmer911
==================
ALLERGIES: N/A
--------------------------------------------------------------------------------
MEDICATIONS:
2013-08-22 [CURRENT] : Acetaminophen 160 MG for Acute bronchitis (disorder)
1996-05-12 [CURRENT] : Acetaminophen 160 MG for Acute bronchitis (disorder)
1995-04-13 [CURRENT] : Acetaminophen 160 MG for Acute bronchitis (disorder)
1984-01-14 [CURRENT] : Penicillin V Potassium 250 MG for Streptococcal sore throat (disorder)
--------------------------------------------------------------------------------
CONDITIONS:
2015-10-30 - 2015-11-07 : Fetus with chromosomal abnormality
2015-10-30 - 2015-11-07 : Miscarriage in first trimester
2015-10-30 - 2015-11-07 : Normal pregnancy
2013-08-22 - 2013-09-08 : Acute bronchitis (disorder)
1985-08-07 -            : Food Allergy: Fish
--------------------------------------------------------------------------------
CARE PLANS:
2013-08-22 [STOPPED] : Respiratory therapy
                         Reason: Acute bronchitis (disorder)
                         Activity: Recommendation to avoid exercise
                         Activity: Deep breathing and coughing exercises
--------------------------------------------------------------------------------
OBSERVATIONS:
2014-01-14 : Body Weight                              73.9 kg
2014-01-14 : Body Height                              163.7 cm
2014-01-14 : Body Mass Index                          27.6 kg/m2
2014-01-14 : Systolic Blood Pressure                  133.0 mmHg
2014-01-14 : Diastolic Blood Pressure                 76.0 mmHg
2014-01-14 : Blood Pressure                           2.0 
--------------------------------------------------------------------------------
PROCEDURES:
2015-10-30 : Standard pregnancy test for Normal pregnancy
2014-01-14 : Documentation of current medications
--------------------------------------------------------------------------------
ENCOUNTERS:
2015-11-07 : Encounter for Fetus with chromosomal abnormality
2015-10-30 : Encounter for Normal pregnancy
2014-01-14 : Outpatient Encounter
2013-08-22 : Encounter for Acute bronchitis (disorder)
--------------------------------------------------------------------------------
'''

api_key = "29e5fa35b999a845ea50daaa50dd7a91f636011d9e111c40671d29495c41cf9d"

TOGETHER_API_KEY = api_key

client = OpenAI(api_key=TOGETHER_API_KEY,
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
      "content": "Create a summary-style report for this patient that describes this patient's current health condition with the aim of educating the patient about their health. Format the report using bullet points and concise language for increased readability. At the end of the report, include a section of recommendations for actions the patient should take, but emphasize that the patient should communicate with their physician. Title the report 'Current Health Report for [patient]' replacing [patient] with the Patient's first and last name.",
    }
  ],
  model="codellama/CodeLlama-13b-Instruct-hf",
  max_tokens=1024
)

print(chat_completion.choices[0].message.content)