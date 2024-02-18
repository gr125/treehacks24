import React from "react"
import { SignedIn, SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/clerk-react'

function Home({ email }) {
    // const { loggedIn, email } = props
    // const navigate = useNavigate();
    
    // const onButtonClick = () => {
    //     if (loggedIn) {
    //         localStorage.removeItem("user")
    //         props.setLoggedIn(false)
    //     } else {
    //         navigate("/login")
    //     }
    // }

//     return (
    
//         <div>

// <div className="nav"></div>
        
//     <div className="mainContainer">
        
//         <div className={"titleContainer"}>
//             <div className="welcomeheader">Welcome!</div>
//         </div>
//         <div className={"buttonContainer"}>
//             <input
//                 className={"inputButton"}
//                 type="button"
//                 onClick={onButtonClick}
//                 value={loggedIn ? "Log out" : "Log in"} />
//             {(loggedIn ? <div>
//                 Your email address is {email}
//             </div> : <div/>)}
//         </div>
//         <div class="footer"></div>
//     </div>
//     </div>
//     )
return (
    <div>
      <header class="nav"></header>
      <h1>Welcome {email}!</h1>
      <p>You have successfully logged in.</p>
      <footer class="footer"></footer>
    </div>
  );
}

export default Home
