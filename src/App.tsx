import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./Admin";
import User from "./User";
import Viewer from "./Viewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
