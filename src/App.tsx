import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./Admin";
import Player from "./Player";
import User from "./User";
import Videos from "./Videos";
import Viewer from "./Viewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
