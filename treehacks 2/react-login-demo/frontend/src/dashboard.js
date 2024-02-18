import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

const DashboardPage = ({ id }) => {
    const [userData, setUserData] = useState({});
    const [error, setError] = useState('');
    const [summary, setSummary] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Send request to get user information using the user ID
            const response = await axios.get(`http://localhost:3080/user/${id}`);

            // Set the user's health data
            setUserData(response.data);
            const readableUserData = formatUserData(userData);
            try {
                const apiKey = '29e5fa35b999a845ea50daaa50dd7a91f636011d9e111c40671d29495c41cf9d'
        
        
                const response = await axios.post('https://api.together.xyz/v1/chat/completions', {
                    messages: [
                        {
                            role: 'system',
                            content: "You are an AI assistant providing the user with a summary of their electronic health record. You are not a physician or a person of authority. You are given this information about the patient: " + readableUserData,
                        },
                        {
                            role: 'user',
                            content: "Create a summary-style report for this patient that describes this patient's current health condition with the aim of educating the patient about their health. Only include information most relevant to the patient. Format the report using bullet points and concise language for increased readability. At the end of the report, include a section of recommendations for actions the patient should take, but emphasize that the patient should communicate with their physician. Title the report 'Current Health Report for [patient]' replacing [patient] with the Patient's first and last name.",
                        }
                    ],
                    model: "codellama/CodeLlama-13b-Instruct-hf",
                    max_tokens: 1024,
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    }
                });
        
                console.log(response);
                console.log(response.data.choices[0].message.content);
        
                setSummary(response.data.choices[0].message.content);
            } catch (error) {
                console.error('Error:', error.message);
            }
            
            // Set summary
            

        } catch (error) {
            setError('An error occurred while fetching user information.');
        }
    };

    function formatUserData(userData) {
        let result = "";
    
        // Format patient data
        if (userData.patients && userData.patients.length > 0) {
            result += "Patient Information:\n";
            userData.patients.forEach(patient => {
                result += `First Name: ${patient.first}\n`;
                result += `Last Name: ${patient.last}\n`;
                result += `Birthdate: ${patient.birthdate}\n`;
                result += `Race: ${patient.race}\n`;
                result += `Ethnicity: ${patient.ethnicity}\n`;
                result += `Address: ${patient.address}\n`;
                result += `City: ${patient.city}\n`;
                result += `State: ${patient.state}\n\n`;
            });
        }
    
        // Format allergies data
        if (userData.allergies && userData.allergies.length > 0) {
            result += "Allergies Information:\n";
            userData.allergies.forEach(allergy => {
                result += `Start: ${allergy.start}\n`;
                result += `Description: ${allergy.description}\n`;
                result += `Type: ${allergy.type}\n`;
                result += `Category: ${allergy.category}\n`;
                result += `Description 1: ${allergy.description1}\n`;
                result += `Severity 1: ${allergy.severity1}\n`;
                result += `Description 2: ${allergy.description2}\n`;
                result += `Severity 2: ${allergy.severity2}\n\n`;
            });
        }
    
        // Format careplans data
        if (userData.careplans && userData.careplans.length > 0) {
            result += "Careplans Information:\n";
            userData.careplans.forEach(careplan => {
                result += `Start: ${careplan.start}\n`;
                result += `Stop: ${careplan.stop}\n`;
                result += `Description: ${careplan.description}\n`;
                result += `Reason Description: ${careplan.reasondescription}\n\n`;
            });
        }
    
        // Format conditions data
        if (userData.conditions && userData.conditions.length > 0) {
            result += "Conditions Information:\n";
            userData.conditions.forEach(condition => {
                result += `Start: ${condition.start}\n`;
                result += `Stop: ${condition.stop}\n`;
                result += `Description: ${condition.description}\n\n`;
            });
        }
    
        // Format observations data
        if (userData.observations && userData.observations.length > 0) {
            result += "Observations Information:\n";
            userData.observations.forEach(observation => {
                result += `Date: ${observation.date}\n`;
                result += `Category: ${observation.category}\n`;
                result += `Description: ${observation.description}\n`;
                result += `Value: ${observation.value}\n`;
                result += `Units: ${observation.units}\n`;
                result += `Type: ${observation.type}\n\n`;
            });
        }
    
        return result;
    }

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-heading">Welcome, {id}</h2>
            {error && <p>{error}</p>}
            {/* {Object.keys(userData).length > 0 && (
                <div className="scrollable-content">
                    <h3 className="dashboard-heading">User Health Information</h3>
                    <ul className="user-info-list">
                        {userData.patients && userData.patients.length > 0 && (
                            <li className="patient-info">
                                <h4>Patient Info</h4>
                                <ul>
                                    {userData.patients.map((patient, index) => (
                                        <li key={index}>
                                            <p>First: {patient.first}</p>
                                            <p>Last: {patient.last}</p>
                                            <p>Race: {patient.race}</p>
                                            <p>Ethnicity: {patient.ethnicity}</p>
                                            <p>Address: {patient.address}</p>
                                            <p>City: {patient.city}</p>
                                            <p>State: {patient.state}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                        {userData.careplans && userData.careplans.length > 0 && (
                            <li>
                                <h4>Careplans</h4>
                                <ul>
                                    {userData.careplans.map((careplan, index) => (
                                        <li key={index}>
                                            <p>Start: {careplan.start}</p>
                                            <p>Stop: {careplan.stop}</p>
                                            <p>Description: {careplan.description}</p>
                                            <p>Reason Description: {careplan.reasondescription}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                        {userData.allergies && userData.allergies.length > 0 && (
                            <li>
                                <h4>Allergies</h4>
                                <ul>
                                    {userData.allergies.map((allergy, index) => (
                                        <li key={index}>
                                            <p>Start: {allergy.start}</p>
                                            <p>Description: {allergy.description}</p>
                                            <p>Type: {allergy.type}</p>
                                            <p>Category: {allergy.category}</p>
                                            <p>Description 1: {allergy.description1}</p>
                                            <p>Severity 1: {allergy.severity1}</p>
                                            <p>Description 2: {allergy.description2}</p>
                                            <p>Severity 2: {allergy.severity2}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                        {userData.conditions && userData.conditions.length > 0 && (
                            <li>
                                <h4>Conditions</h4>
                                <ul>
                                    {userData.conditions.map((condition, index) => (
                                        <li key={index}>
                                            <p>Start: {condition.start}</p>
                                            <p>Stop: {condition.stop}</p>
                                            <p>Description: {condition.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                        {userData.observations && userData.observations.length > 0 && (
                            <li>
                                <h4>Observations</h4>
                                <ul>
                                    {userData.observations.map((observation, index) => (
                                        <li key={index}>
                                            <p>Date: {observation.date}</p>
                                            <p>Category: {observation.category}</p>
                                            <p>Description: {observation.description}</p>
                                            <p>Value: {observation.value}</p>
                                            <p>Units: {observation.units}</p>
                                            <p>Type: {observation.type}</p>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            )} */}
            <p>{summary}</p>
        </div>
    );
};

export default DashboardPage;
