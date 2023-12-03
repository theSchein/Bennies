// pages/index.js
// This is the homepage for the App and is the first page that is loaded when the app is opened.

import WaitlistForm from "@/components/WaitlistForm";

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
    <div>
        <WaitlistForm />
    </div>
</div>
    );
}
