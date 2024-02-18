import React, { useState, useEffect } from "react";
import axios from "axios";
import './home.css'

function Home({ email }) {
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(true)

    const [question, setQuestion] = useState("")

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
                setLoading(false); // Update loading state after fetching
            }
        };

        getData();
    }, []);

return (
    <div>
      <header className="nav"></header>
<<<<<<< HEAD
      <h1 className="welcomeheader">Welcome {email}!</h1>
      {loading ? ( // Conditional rendering of loading indicator
=======
      <div style={{overflowY: 'auto' }}>
      <h1 className="welcomeheader">Welcome!</h1>
      {loadingProfile ? ( // Conditional rendering of loading indicator
>>>>>>> e08cf21b3d46f23f7818b589c9661e453fb08c22
                <h2 className="loadingheader">Loading health summary...</h2>
            ) : (
                <h2>{profileData.split("* Allergies:")[0].trim()}</h2>
            )}
      {loading ? ( // Conditional rendering of loading indicator
                <p> </p>
            ) : (
                <div style={{ maxWidth: '800px', maxHeight: '300px', overflowY: 'auto',  padding: '10px',border: '1px solid #ccc' }}>
                * Allergies: {profileData.split("* Allergies:")[1]}
            </div>
            )}
<<<<<<< HEAD
      
      <footer class="footer"></footer>
=======
      {loadingProfile ? ( // Conditional rendering of loading indicator
                <p> </p>
            ) : (
                <div>
                    <h2 className="loadingheader">Ask me about your health!</h2>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                    />
                    <button onClick={handleSubmit}>Submit Question</button>
                </div>
            )}
      {loadingChatAnswer ? ( // Conditional rendering of loading indicator
                <p> </p>
            ) : (
                <div style={{ maxWidth: '800px', maxHeight: '300px', overflowY: 'auto',  padding: '10px',border: '1px solid #ccc' }}>
                {chatAnswer}
            </div>
            )}
      </div>
      <div class="footer">
        <div class="footer_contents"></div>
      </div>
>>>>>>> e08cf21b3d46f23f7818b589c9661e453fb08c22
    </div>
  );
}

export default Home
