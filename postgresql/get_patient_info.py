import psycopg2

def get_patient_info(patient_id):
    try:
        # Connect to the database
        conn = psycopg2.connect(
            dbname="ehr",
            user="brendantang",
            host="localhost",
            port="5432"
        )

        # Create a cursor object
        cur = conn.cursor()
        # Fetch data from different tables based on patient ID

        cur.execute("""
            SELECT first, last FROM patients WHERE id = %s;
        """, (patient_id,))
        patient_data = cur.fetchall()

        cur.execute("""
            SELECT start, description, type, category, description1, severity1, description2, severity2 FROM allergies WHERE patient = %s;
        """, (patient_id,))
        allergies_data = cur.fetchall()

        cur.execute("""
            SELECT START,STOP,DESCRIPTION FROM conditions WHERE patient = %s;
        """, (patient_id,))
        conditions_data = cur.fetchall()

        cur.execute("""
            SELECT DATE,CATEGORY,DESCRIPTION,VALUE,UNITS,TYPE FROM observations WHERE patient = %s;
        """, (patient_id,))
        observations_data = cur.fetchall()

        # Fetch careplans information
        cur.execute("""
            SELECT start, stop, description, reasondescription
            FROM careplans 
            WHERE patient = %s 
            AND ((stop IS NULL OR stop >= CURRENT_DATE - INTERVAL '2 years') 
            OR start >= CURRENT_DATE - INTERVAL '4 years');
        """, (patient_id,))
        careplans_data = cur.fetchall()

        # Close cursor and connection
        cur.close()
        conn.close()

        # Return fetched data
        return {
            "patient": patient_data,
            "allergies": allergies_data,
            "conditions": conditions_data,
            "observations": observations_data,
            "careplans": careplans_data
        }

    except psycopg2.Error as e:
        print("Error connecting to PostgreSQL database:", e)

def write_patient_info_to_file(patient_info, file_path):
    try:
        with open(file_path, 'w') as file:
            # Writing patient information
            patient_data = patient_info['patient']
            file.write("Patient Information:\n\n")
            file.write(f"First Name: {patient_data[0][0]}\n")
            file.write(f"Last Name: {patient_data[0][1]}\n\n")
            
            # Writing allergies
            allergies_data = patient_info['allergies']
            file.write("Allergies:\n")
            for allergy in allergies_data:
                file.write(f"Start: {allergy[0]}, Description: {allergy[1]}, Type: {allergy[2]}, Category: {allergy[3]}, Reaction1: {allergy[4]}, Severity1: {allergy[5]}, Reaction2: {allergy[6]}, Severity2: {allergy[7]}\n")
            file.write("\n")
            
            # Writing conditions
            conditions_data = patient_info['conditions']
            file.write("Conditions:\n")
            for condition in conditions_data:
                file.write(f"Start: {condition[0]}, Stop: {condition[1]}, Description: {condition[2]}\n")
            file.write("\n")
            
            # Writing observations
            observations_data = patient_info['observations']
            file.write("Observations:\n")
            for observation in observations_data:
                file.write(f"Date: {observation[0]}, Category: {observation[1]}, Description: {observation[2]}, Value: {observation[3]}, Units: {observation[4]}, Type: {observation[5]}\n")
            file.write("\n")

            # Extracting careplans data
            careplans_data = patient_info['careplans']
            file.write("Careplans:\n")
            for careplan in careplans_data:
                file.write(f"Start: {careplan[0]}, Stop: {careplan[1]}, Description: {careplan[2]}, ReasonDescription: {careplan[3]}\n")
            file.write("\n")
        
        print(f"Patient information has been written to {file_path}")

    except IOError as e:
        print("Error writing to file:", e)

def format_patient_info(patient_info):
    output = ""

    # Extracting patient data
    patient_data = patient_info['patient']
    output += "Patient Information:\n"
    output += f"First Name: {patient_data[0][0]}\n"
    output += f"Last Name: {patient_data[0][1]}\n\n"

    # Extracting allergies data
    allergies_data = patient_info['allergies']
    output += "Allergies:\n"
    for allergy in allergies_data:
        output += f"Start: {allergy[0]}, Description: {allergy[1]}, Type: {allergy[2]}, Category: {allergy[3]}, Reaction1: {allergy[4]}, Severity1: {allergy[5]}, Reaction2: {allergy[6]}, Severity2: {allergy[7]}\n"
    output += "\n"

    # Extracting conditions data
    conditions_data = patient_info['conditions']
    output += "Conditions:\n"
    for condition in conditions_data:
        output += f"Start: {condition[0]}, Stop: {condition[1]}, Description: {condition[2]}\n"
    output += "\n"

    # Extracting observations data
    observations_data = patient_info['observations']
    output += "Observations:\n"
    for observation in observations_data:
        output += f"Date: {observation[0]}, Category: {observation[1]}, Description: {observation[2]}, Value: {observation[3]}, Units: {observation[4]}, Type: {observation[5]}\n"
    output += "\n"

    # Extracting careplans data
    careplans_data = patient_info['careplans']
    output += "Careplans:\n"
    for careplan in careplans_data:
        output += f"Start: {careplan[0]}, Stop: {careplan[1]}, Description: {careplan[2]}, ReasonDescription: {careplan[3]}\n"
    output += "\n"


    return output

# Example usage
patient_id = "5855704c-f73e-5983-0dcd-60049d34bd19"
patient_info = get_patient_info(patient_id)
write_patient_info_to_file(patient_info, 'output.txt')
output = format_patient_info(patient_info)
print(output)
