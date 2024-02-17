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

        # Close cursor and connection
        cur.close()
        conn.close()

        # Return fetched data
        return {
            "allergies": allergies_data,
            "conditions": conditions_data,
            "observations": observations_data
        }

    except psycopg2.Error as e:
        print("Error connecting to PostgreSQL database:", e)

# Example usage
patient_id = "5855704c-f73e-5983-0dcd-60049d34bd19"
patient_info = get_patient_info(patient_id)
print(patient_info)
