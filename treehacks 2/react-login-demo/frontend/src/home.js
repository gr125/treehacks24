import React, { useState, useEffect } from "react";
import axios from "axios";

function Home({ email }) {
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(true)

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
      <header class="nav"></header>
      <h1>Welcome {email}!</h1>
      {loading ? ( // Conditional rendering of loading indicator
                <h2>Loading health summary...</h2>
            ) : (
                <h2>{profileData.split("* Allergies:")[0].trim()}</h2>
            )}
      {loading ? ( // Conditional rendering of loading indicator
                <p> </p>
            ) : (
                <div style={{ maxWidth: '800px', maxHeight: '300px', overflowY: 'auto',  padding: '10px',border: '1px solid #ccc' }}>
                {profileData.split("* Allergies:")[1]}
            </div>
            )}
      
      <footer class="footer"></footer>
    </div>
  );
}

export default Home
