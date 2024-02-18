import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css'

function Login({ onLogin }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [logInError, setLogInError] = useState("")
    
    //const navigate = useNavigate();
        
    const onButtonClick = () => {

        setEmailError("")
        setPasswordError("")

        if ("" === email) {
            setEmailError("Please enter your email")
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email")
            return
        }

        if ("" === password) {
            setPasswordError("Please enter a password")
            return
        }

        if (password.length < 7) {
            setPasswordError("The password must be 8 characters or longer")
            return
        }

        const hardcodedEmail = 'example@example.com';
        const hardcodedPassword = 'password';

        if (email === hardcodedEmail && password === hardcodedPassword) {
            // Authentication successful
            onLogin(email);
        } else {
            // Authentication failed
            setLogInError('Invalid email or password');
        }        
  

    };
    return (
        <div>
          <header class="nav"></header>
          <div class='verticalbox'>
          <div class='loginheader'>Login Page</div>
          <div class='textbox'>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>
          <div class='textbox'>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>
          <button onClick={onButtonClick}>Login</button>
          {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
          {logInError && <p style={{ color: 'red' }}>{logInError}</p>}
          <footer class="footer"></footer>
          </div>
        </div>
      );
    }
    


//     const checkAccountExists = (callback) => {
//         fetch("http://localhost:3080/check-account", {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//               },
//             body: JSON.stringify({email})
//         })
//         .then(r => r.json())
//         .then(r => {
//             callback(r?.userExists)
//         })
//     }

//     const logIn = () => {
//         fetch("http://localhost:3080/auth", {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//               },
//             body: JSON.stringify({email, password})
//         })
//         .then(r => r.json())
//         .then(r => {
//             if ('success' === r.message) {
//                 localStorage.setItem("user", JSON.stringify({email, token: r.token}))
//                 props.setLoggedIn(true)
//                 props.setEmail(email)
//                 navigate("/")
//             } else {
//                 window.alert("Wrong email or password")
//             }
//         })
//     }

//     return <div>
//     <div className="nav"></div>
//         <div className={"mainContainer"}>
//         <div className={"titleContainer"}>
//             <div className="loginheader">Account Login</div>
//         </div>
//         <br />
//         <div className={"inputContainer"}>
//             <input
//                 value={email}
//                 placeholder="Email"
//                 onChange={ev => setEmail(ev.target.value)}
//                 className={"inputBox"} />
//             <label className="errorLabel">{emailError}</label>
//         </div>
//         <br />
//         <div className={"inputContainer"}>
//             <input
//                 type="password"
//                 value={password}
//                 placeholder="Password"
//                 onChange={ev => setPassword(ev.target.value)}
//                 className={"inputBox"} />
//             <label className="errorLabel">{passwordError}</label>
//         </div>
//         <br />
//         <div className={"inputContainer"}>
//             <input
//                 className={"inputButton"}
//                 type="button"
//                 onClick={onButtonClick}
//                 value={"Log in"} />
//         </div>
//         <div class="footer"></div>
//     </div>
//     </div>
// }

export default Login