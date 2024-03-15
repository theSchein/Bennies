// componets/universe/universe.jsx
//
import { useState } from "react";

function Universe() {
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [separator, setSeparator] = useState("");

    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        const response = await fetch("/api/universe/createUniverse", {
            method: "POST",
            body: JSON.stringify({ address, name, separator }), // Ensure this matches your state and backend expectations
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
            // Handle errors, e.g., show an error message
            console.error("Failed to create universe");
        } else {
            // Handle success, e.g., clear form, show success message
            console.log("Universe created successfully");
        }
    }


    return (
        <div>
            <h1>Universe</h1>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Contract Address"
            />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter New Universe Name"
            />
            <input
                type="text"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                placeholder="Enter Separator Field For Collections"
            />
            <button className="btn" onClick={handleSubmit}>Create Universe</button>
        </div>
    );
}

export default Universe;
