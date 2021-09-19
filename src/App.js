import { useState, useEffect, useCallback } from "react";
import "./styles.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import { debounce, setHeading } from "./utils";
import { Toast, LoginSignup } from "./Components";

export default function App() {
  const [serverData, setServerData] = useState([]);
  const [searchResult, setSearchResults] = useState([]);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const debounceOnChange = useCallback(debounce(updateBySearch, 400), [
    serverData
  ]);
  const [toast, setToast] = useState("none");
  const [view, setView] = useState(1);
  const [loginDisp, setLoginDisp] = useState("none");
  const token = localStorage.getItem("snippetter");
  const [isLoggedIn, setLoginState] = useState(token ? true : false);
  useEffect(() => {
    axios.get("https://code-snippet.gackrey.repl.co/snippet").then((data) => {
      setServerData(data.data);
      setSearchResults(data.data);
    });
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get("https://code-snippet.gackrey.repl.co/user-saved-snippets", {
          headers: { authorization: token }
        })
        .then((data) => {
          let snippet_ids = data.data.snippets;
          let savedSnippets = serverData.filter((code) =>
            snippet_ids.includes(code.id)
          );
          setSavedSnippets(savedSnippets);
        });
    }
  }, [serverData, token]);

  function Login() {
    if (token) {
      localStorage.removeItem("snippetter");
      setLoginState(false);
    } else setLoginDisp("flex");
  }
  function updateBySearch(searchText) {
    const updatedData = serverData.filter((data) =>
      data.category.includes(searchText)
    );
    setSearchResults(updatedData);
  }
  async function saveSnippet(id) {
    if (token) {
      await axios.post(
        "https://code-snippet.gackrey.repl.co/save-snippet",
        { id },
        {
          headers: { authorization: token }
        }
      );
      const findSnippet = serverData.find((code) => code.id === id);
      setSavedSnippets((curr) => [...curr, findSnippet]);
    } else setToast("block");
  }
  return (
    <div className="App">
      <button className="btn pos" onClick={Login}>
        {isLoggedIn ? "Log Out" : "Login"}
      </button>
      <Toast display={toast} setDisplay={setToast} />
      <LoginSignup
        display={loginDisp}
        setDisplay={setLoginDisp}
        serverData={serverData}
        setSavedSnippets={setSavedSnippets}
        setLoginState={setLoginState}
      />

      <input
        className="search"
        type="text"
        placeholder="Search"
        onChange={(e) => debounceOnChange(e.target.value)}
      />
      <div>
        <span
          className="snippets-mode"
          style={view === 1 ? { borderBottom: "3px solid #007bff" } : {}}
          onClick={() => setView(1)}
        >
          All Snippets
        </span>
        <span
          className="snippets-mode"
          style={view === 2 ? { borderBottom: "3px solid #007bff" } : {}}
          onClick={() => {
            if (token) {
              setView(2);
            } else setToast("block");
          }}
        >
          Saved Snippets
        </span>
      </div>
      <div style={view === 1 ? { display: "block" } : { display: "none" }}>
        {serverData.length !== 0 ? (
          searchResult.map((code) => (
            <div key={code.id} className="code-container">
              <div className="header-box">
                <h2 className="heading">{setHeading(code.category)}</h2>
                <button className="btn" onClick={() => saveSnippet(code.id)}>
                  Save
                </button>
              </div>
              <SyntaxHighlighter language="jsx" style={okaidia}>
                {code.code}
              </SyntaxHighlighter>
            </div>
          ))
        ) : (
          <p className="not-available">Loading....</p>
        )}
      </div>
      <div style={view === 2 ? { display: "block" } : { display: "none" }}>
        {savedSnippets.length !== 0 ? (
          savedSnippets.map((code) => (
            <div key={code.id} className="code-container">
              <div className="header-box">
                <h2 className="heading">{setHeading(code.category)}</h2>
              </div>
              <SyntaxHighlighter language="jsx" style={okaidia}>
                {code.code}
              </SyntaxHighlighter>
            </div>
          ))
        ) : (
          <p className="not-available">No saved snippet</p>
        )}
      </div>
    </div>
  );
}
