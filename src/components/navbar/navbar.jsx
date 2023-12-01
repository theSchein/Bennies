// components/navbar/navbar.jsx
// This component handles the logic and presentation for the navbar.
// Most of this was ripped form mui docs and modified to fit our needs.

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
// import logo from '..\src\assets\logo.svg'

const style = {
  wrapper: `p-4 w-screen flex items-center`,
  headerLogo: `flex`,
  nav: `flex-1 flex justify-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[1.1rem] cursor-pointer rounded-3xl`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `w-1/4`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[1.1rem] font-semibold cursor-pointer`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
  buttonAccent: `bg-[#172A42] border border-[#163256] hover:border-[#234169] h-full rounded-2xl flex items-center justify-center font-semibold text-[1.1rem] text-[#4F90EA]`,
}

const Header = () => {
  const [selectedNav, setSelectedNav] = useState('home')

  return (
    <div className={style.wrapper}>
      {/* <div className={style.headerLogo}>
        <Image src={logo} alt='logo' height={80} width={80} />
      </div> */}
      <div className={style.nav}>
        <div className={style.navItemsContainer}>
        <div onClick={() => setSelectedNav('home')}
            className={`${style.navItem} ${
              selectedNav === '/' && style.activeNavItem
            }`}
          ><Link href="/">
              Home
            </Link>
            </div>
            <div
            onClick={() => setSelectedNav('pitchdeck')}
            className={`${style.navItem} ${
              selectedNav === 'pitchdeck' && style.activeNavItem
            }`}
          ><Link href="/pitchdeck">
          Pitch Deck
        </Link>
          </div>
          <div
            onClick={() => setSelectedNav('team')}
            className={`${style.navItem} ${
              selectedNav === 'team' && style.activeNavItem
            }`}
          ><Link href="/team">
          Team
        </Link>
          </div>
          <div
            onClick={() => setSelectedNav('signin')}
            className={`${style.navItem} ${
              selectedNav === 'signin' && style.activeNavItem
            }`}
          ><Link href="/signin">
          Sign In
        </Link>
          </div>
          <div
            onClick={() => setSelectedNav('contact')}
            className={`${style.navItem} ${
              selectedNav === 'contact' && style.activeNavItem
            }`}
          >
            <Link href="/contact">
          Contact Us
        </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
