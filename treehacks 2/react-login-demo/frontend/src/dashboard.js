import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

const DashboardPage = ({ id }) => {
    const [userData, setUserData] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Send request to get user information using the user ID
            const response = await axios.get(`http://localhost:3080/user/${id}`);

            // Set the user's health data
            setUserData(response.data);
        } catch (error) {
            setError('An error occurred while fetching user information.');
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-heading">Welcome, {id}</h2>
            {error && <p>{error}</p>}
            {Object.keys(userData).length > 0 && (
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
            )}
        </div>
    );
};

export default DashboardPage;
