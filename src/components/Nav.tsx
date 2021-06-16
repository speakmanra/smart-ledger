import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Navbar, Button, Alignment, Drawer, Classes, Icon } from '@blueprintjs/core';
import img from '../assets/logo512.png'
import './stylesheets/navbar.scss';

export default function Nav() {
  let activeRouteInit = {
    home: false,
    wallets: false,
    globalStats: false,
    donations: false
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(activeRouteInit);

  const history = useHistory();

  const navigateTo = (url: string) => {
    if (url !== window.location.pathname) {
      history.push(url);
      setMenuOpen(false);
    }
  }

  useEffect(() => {
    history.listen((location) => { 
      const { pathname } = location;
        const routes = {
          home: pathname === '/',
          wallets: pathname === '/wallets',
          globalStats: pathname === '/global-stats',
          donations: pathname === '/donations'
        }
        setActiveRoute(routes);
      }) 
    }, [history]);

  const activeIcon = (active: boolean) => {
    if(active) {
      return <Icon icon="compass" />
    }
  }

  return (
    <span>
      <Navbar className="bp3-dark" fixedToTop={true}>
        <Navbar.Group className="left" onClick={() => setMenuOpen(!menuOpen)} align={Alignment.LEFT}>
          <Button className="bp3-minimal" icon={menuOpen ? 'menu-open' : 'menu'} />
          <Navbar.Heading>{ activeRoute.wallets ? 'Wallets' : activeRoute.globalStats ? 'Global Stats' : activeRoute.donations ? 'Donations' : 'Smart Ledger'}</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <img onClick={() => navigateTo('/')} src={img} alt="logo" />
        </Navbar.Group>
      </Navbar>
      <Drawer 
        isOpen={menuOpen}
        position="left"
        size={200}
        title="Smart Ledger"
        canOutsideClickClose={true}
        onClose={() => setMenuOpen(false)}
        >
        <div className={Classes.DRAWER_BODY}>
          <div className={Classes.DIALOG_BODY}>
            <div onClick={() => navigateTo('/')} style={activeRoute.home ? {color: 'white'}  : {opacity: 1}} className='nav-item'>
              <div className={activeRoute.home ? 'active-left' : ''}>{activeIcon(activeRoute.home)}<span>Home</span></div><Icon icon="home" /></div>
            <div onClick={() => navigateTo('/wallets')} style={activeRoute.wallets ? {color: 'white'}  : {opacity: 1}} className='nav-item'>
              <div className={activeRoute.wallets ? 'active-left' : ''}>{activeIcon(activeRoute.wallets)}<span>Wallets</span></div> <Icon icon="credit-card" /></div>
            <div onClick={() => navigateTo('/global-stats')} style={activeRoute.globalStats ? {color: 'white'}  : {opacity: 1}} className='nav-item'>
              <div className={activeRoute.globalStats ? 'active-left' : ''}>{activeIcon(activeRoute.globalStats)}<span>Golbal Stats</span></div> <Icon icon="panel-stats" /></div>
            <div onClick={() => navigateTo('/donations')} style={activeRoute.donations ? {color: 'white'}  : {opacity: 1}} className='nav-item'>
              <div className={activeRoute.donations ? 'active-left' : ''}>{activeIcon(activeRoute.donations)}<span>Donations</span></div> <Icon icon="thumbs-up" /></div>
          </div>
        </div>
      </Drawer>
    </span>
  )
}
