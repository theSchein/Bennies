//team profile page
import React from "react"
import Image from 'next/image'
import Ben from '../assets/Headshot.jpg'
import Joe from '../assets/Headshot.jpg'

const Team = () => {
return (
<>
<h2 className="flex px-6 py-6 text-5xl font-bold text-sky-500">About Us</h2>
<div>
<figure className="py-6 md:flex rounded-xl p-8 md:p-0">
  <Image className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src={Ben} alt="" width="512" height="512" />
  <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
    <blockquote>
      <p className="text-md font-medium">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </blockquote>
    <figcaption className="font-medium">
      <div className="text-sky-500">
        Ben
      </div>
      <div className="text-white">
        President
      </div>
    </figcaption>
  </div>
</figure>

</div>
<figure className="md:flex rounded-xl p-8 md:p-0">
  <Image className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src={Joe} alt="" width="512" height="512" />
  <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
    <blockquote>
      <p className="text-md font-medium">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </blockquote>
    <figcaption className="font-medium">
      <div className="text-sky-500">
        Joseph Moran
      </div>
      <div className="text-white">
        CTO
      </div>
    </figcaption>
  </div>
</figure>
</>
)
};

export default Team 