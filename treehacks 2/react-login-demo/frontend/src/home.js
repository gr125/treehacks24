import React, { useState, useEffect } from "react";
import axios from "axios";

function Home({ email }) {
    const [profileData, setProfileData] = useState(null)

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
        let ignore = false;
            
        if (!ignore)  getData()
            return () => { ignore = true; }
    },[]);

return (
    <div>
      <header class="nav"></header>
      <h1>Welcome {email}!</h1>
      <h2>{profileData.split("* Allergies:")[0].trim()}</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto',  padding: '10px' }}>
                {profileData.split("* Allergies:")[1]}
            </div>
      <footer class="footer"></footer>
    </div>
  );
}

export default Home
