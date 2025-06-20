import { Navigate, Route, Routes } from "react-router-dom";
import "../styles/App.css";
import LinkList from "./LinkList";
import CreateLink from "./CreateLink";
import Header from "./Header";
import Login from "./Login";
import Search from "./Search";

function App() {
  return (
    <div className="center w85">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/new/1" replace />} />
        <Route path="/create" element={<CreateLink />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/top" element={<LinkList />} />
        <Route path="/new/:page" element={<LinkList />} />
      </Routes>
    </div>
  );
}

export default App;
