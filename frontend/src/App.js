import { BrowserRouter as Router, Route,Redirect, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/account/login/Login';
import Register from './pages/account/register/Register';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"  element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;
