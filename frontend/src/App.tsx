import { Routes, Route } from "react-router-dom";
  import Home from "./components/Home";
  import ChatPage from "./components/ChatPage";

  function App() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    );
  }

  export default App