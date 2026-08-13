import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { CreateSession } from "./pages/CreateSession";
import { JoinSession } from "./pages/JoinSession";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/join" element={<JoinSession />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;