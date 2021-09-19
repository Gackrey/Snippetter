import { useState } from "react";
import axios from "axios";
export const LoginSignup = ({
  display,
  setDisplay,
  serverData,
  setSavedSnippets,
  setLoginState
}) => {
  const [view, setView] = useState(1);
  const [lUsername, setLUsername] = useState("");
  const [lPassword, setLPassword] = useState("");
  const [sUsername, setSUsername] = useState("");
  const [sPassword, setSPassword] = useState("");
  async function Signup(e) {
    e.preventDefault();
    const response = await axios.post(
      "https://code-snippet.gackrey.repl.co/signup",
      {
        username: sUsername,
        password: sPassword
      }
    );
    if (response) {
      localStorage.setItem("snippetter", response.data.token);
      setLoginState(true);
      close();
    }
  }
  async function Login(e) {
    e.preventDefault();
    const response = await axios.post(
      "https://code-snippet.gackrey.repl.co/login",
      {
        username: lUsername,
        password: lPassword
      }
    );
    if (response) {
      localStorage.setItem("snippetter", response.data.token);
      let snippet_ids = response.data.snippets;
      let savedSnippets = serverData.filter((code) =>
        snippet_ids.includes(code.id)
      );
      setSavedSnippets(savedSnippets);
      setLoginState(true);
      close();
    }
  }
  function close() {
    setDisplay("none");
    setLUsername("");
    setLPassword("");
    setSUsername("");
    setSPassword("");
  }
  return (
    <div style={{ display: display }} className="background-cover">
      <div className="lsbox">
        <h1>Login or Signup</h1>
        <div>
          <span
            className="snippets-mode"
            style={view === 1 ? { borderBottom: "3px solid #007bff" } : {}}
            onClick={() => setView(1)}
          >
            Login
          </span>
          <span
            className="snippets-mode"
            style={view === 2 ? { borderBottom: "3px solid #007bff" } : {}}
            onClick={() => setView(2)}
          >
            Sign Up
          </span>
        </div>
        <form
          style={view === 1 ? { display: "block" } : { display: "none" }}
          onSubmit={(e) => Login(e)}
        >
          <input
            type="text"
            placeholder="Username"
            value={lUsername}
            required
            onChange={(e) => setLUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={lPassword}
            required
            onChange={(e) => setLPassword(e.target.value)}
          />
          <input type="submit" value="Login" />
        </form>
        <form
          style={view === 2 ? { display: "block" } : { display: "none" }}
          onSubmit={(e) => Signup(e)}
        >
          <input
            type="text"
            placeholder="Username"
            value={sUsername}
            required
            onChange={(e) => setSUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={sPassword}
            required
            onChange={(e) => setSPassword(e.target.value)}
          />
          <input type="submit" value="Sign Up" />
        </form>
        <button onClick={close}>Close</button>
      </div>
    </div>
  );
};
