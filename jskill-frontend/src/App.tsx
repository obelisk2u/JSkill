import { BrowserRouter, Routes, Route } from "react-router-dom";
import Simulation from "@/pages/Simulation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simulation />} />
      </Routes>
    </BrowserRouter>
  );
}
