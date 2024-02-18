from openai import OpenAI
import sys
TOGETHER_API_KEY = "29e5fa35b999a845ea50daaa50dd7a91f636011d9e111c40671d29495c41cf9d"
chat = []

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
    return chat_completion.choices[0].message.content

def process_input(input_string):
    """
    Process the input string and return the output string.

    Parameters:
        input_string (str): The input string to be processed.

    Returns:
        str: The output string.
    """
    # Implement your processing logic here
    output_string = input_string.upper()  # Example: Convert input to uppercase

    return output_string


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script_name.py input_string")
        sys.exit(1)

    # Extract the input string from command-line arguments
    input_string = sys.argv[1]

    # Process the input string
    output_string = get_summary(TOGETHER_API_KEY, input_string)

    # Print the output
    print(output_string)
