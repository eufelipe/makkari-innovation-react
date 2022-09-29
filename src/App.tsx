import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Admin from "./Admin";
import User from "./User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;