import { useState } from 'react';
import Header from './Header';
import Main from './Main';
import classes from './Dashboard.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = (props) => {
  const [navbarOpen, setNavbarOpen] = useState(true)

  const toggleNavBar = () => {
    setNavbarOpen(prop => !prop)
  }

  return (
    <div className={classes.dashboard}>
      <ToastContainer />
      <Header toggleNavBar={toggleNavBar} username={props.username} setLoggedOut={props.setLoggedOut} />
      <Main navbarOpen={navbarOpen} username={props.username}/>
    </div>
  );
}

export default Dashboard;
