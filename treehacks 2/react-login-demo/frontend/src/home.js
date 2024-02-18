import React, { useState, useEffect } from "react";
import axios from "axios";
import './home.css'
import logo from './assets/logo.png'

function Home({ email }) {
    const [profileData, setProfileData] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(true)

    const [question, setQuestion] = useState("")
    const [chatAnswer, setChatAnswer] = useState(null)
    const [loadingChatAnswer, setLoadingChatAnswer] = useState(true)

    function getData() {
        axios({
          method: "GET",
          url:"/profile",
        })
        .then((response) => {
          const res =response.data
          setProfileData(res)
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })}
    
     useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('/profile');
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoadingProfile(false); // Update loading state after fetching
            }
        };

        getData();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/chatbot', {question:question, user_summary:profileData}); // Make a GET request to the server endpoint
            setChatAnswer(response.data); // Update the profile data state with the response data
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoadingChatAnswer(false);
        }
    };


    return (
        <div>
            <header className="nav"></header>
            <div className='scrollable-content' style={{ overflowY: 'auto' }}>
                <div className='grid-container'>
                    <h1 className="welcomeheader">Welcome!</h1>
                    <div className='logo'><img src={logo} alt='' /></div>
                </div>
                {loadingProfile ? ( // Conditional rendering of loading indicator
                    <h2 className="loadingheader">Loading health summary...</h2>
                ) : (
                    <h2>{profileData.split("* Allergies:")[0].trim()}</h2>
                )}
                {loadingProfile ? ( // Conditional rendering of loading indicator
                    <p> </p>
                ) : (
                    <div style={{ maxWidth: '800px', maxHeight: '300px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc' }}>
                        * Allergies: {profileData.split("* Allergies:")[1]}
                    </div>
                )}
            </div>
    
            <div>
                {loadingProfile ? ( // Conditional rendering of loading indicator
                    <p> </p>
                ) : (
                    <div>
                        <h2>Ask me about your health!</h2>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Enter your question"
                        />
                        <button className="small-button" onClick={handleSubmit}>Submit Question</button>
                    </div>
                )}
                {loadingChatAnswer ? ( // Conditional rendering of loading indicator
                    <p> </p>
                ) : (
                    <div style={{ maxWidth: '800px', maxHeight: '300px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc' }}>
                        {chatAnswer}
                    </div>
                )}
            </div>
    
        </div>
    );}

export default Home
