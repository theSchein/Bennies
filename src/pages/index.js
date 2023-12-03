// pages/index.js
// This is the homepage for the App and is the first page that is loaded when the app is opened.

export default function Home() {
    return (
<div className="min-h-screen flex flex-col items-center justify-center p-2">
    <div className="bg-primary py-10 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-2xl max-w-xl mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-secondary text-center leading-tight">
            DISCOVRY.XYZ
        </h1>
    </div>

    <div className="bg-primary p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl max-w-2xl space-y-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-secondary text-left leading-relaxed">
            Finding out what your NFT does is hard.
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-secondary text-left">
            Discovry.xyz shows you the utility and rights of each NFT and incentivizes active engagement between the creators and owners.
        </p>
    </div>

    <div className="mt-10 bg-primary p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h3 className="font-subheading text-xl sm:text-2xl lg:text-2xl mb-4 text-secondary text-center">
            Join Waitlist for Beta
        </h3>
        <input className="w-full p-2 sm:p-3 mb-3 border-2 border-cyan-500 rounded-lg" type="text" placeholder="Name" />
        <input className="w-full p-2 sm:p-3 mb-3 border-2 border-cyan-500 rounded-lg" type="text" placeholder="Email" />
        <button className="w-full py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-yellow-950 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-cyan-700 transition duration-300">
            Submit
        </button>
    </div>
</div>
    );
}
