import { Route, Routes } from "react-router-dom";
import "../styles/App.css";
import LinkList from "./LinkList";
import CreateLink from "./CreateLink";
import Header from "./Header";
import Login from "./Login";

function App() {
  return (
    <div className="center w85">
      <Header />
      <Routes>
        <Route path="/" element={<LinkList />} />
        <Route path="/create" element={<CreateLink />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
