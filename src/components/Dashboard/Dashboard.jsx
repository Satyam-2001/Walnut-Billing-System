import { useState } from 'react';
import Header from './Header';
import Main from './Main';
import classes from './Dashboard.module.css';

const Dashboard = (props) => {
  const [navbarOpen, setNavbarOpen] = useState(true)

  const toggleNavBar = () => {
    setNavbarOpen(prop => !prop)
  }

  return (
    <div className={classes.dashboard}>
      <Header toggleNavBar={toggleNavBar} username={props.username} setLoggedOut={props.setLoggedOut} />
      <Main navbarOpen={navbarOpen}/>
    </div>
  );
}

export default Dashboard;
