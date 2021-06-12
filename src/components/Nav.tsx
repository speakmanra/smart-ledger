import React, { useState } from 'react'
import { Navbar, Button, Alignment } from '@blueprintjs/core'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Navbar className="bp3-dark" fixedToTop={true}>
      <Navbar.Group align={Alignment.LEFT}>
        <Button className="bp3-minimal" onClick={() => setMenuOpen(!menuOpen)} icon={menuOpen ? 'menu-open' : 'menu'} />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Navbar.Heading>Smart Ledger</Navbar.Heading>
      </Navbar.Group>
    </Navbar>
  )
}
