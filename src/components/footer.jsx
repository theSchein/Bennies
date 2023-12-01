// components/footer.jsx
// Footer style component. There is no logic to actually handle anything here.
// The footer should be revisted and updated to be more useful.

import React from "react"

function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer>
      <p className="text-center font-bold">Copyright ⓒ {year}</p>
      <p className="text-center font-bold">All Rights Reserved By Discovry</p>
    </footer>
  )
}

export default Footer

