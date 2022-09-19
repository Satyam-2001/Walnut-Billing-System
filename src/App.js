import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/LogIn Screen/Login'
import LoginContext from './context/login-context';

const MainApp = () => {
  const [isLogin, setIsLogin] = useState(null)

  const setLoggedOut = () => {
    setIsLogin(null)
  }

  return (
    <LoginContext.Provider value={setLoggedOut}>
      {isLogin ? <Dashboard username={isLogin} setLoggedOut={setLoggedOut} /> : <Login loggedIn={(name) => setIsLogin(name)} />}
    </LoginContext.Provider>
  )
}

const App = () => {

  return (
    <BrowserRouter basename='/crm'>
      <Routes>
        <Route path="/" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
