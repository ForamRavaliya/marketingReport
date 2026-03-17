import {BrowserRouter,Routes,Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Clients from "./pages/Clients";
import Navbar from "./components/Navbar";

function App(){
 return(
 <BrowserRouter>
  <Navbar/>
  <Routes>
   <Route path="/" element={<Dashboard/>}/>
   <Route path="/upload" element={<Upload/>}/>
   <Route path="/clients" element={<Clients/>}/>
  </Routes>
 </BrowserRouter>
 );
}
export default App;
