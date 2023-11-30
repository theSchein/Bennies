// pages/pitchdeck.js
// This page displays the pdf of the pitchdeck, needs to look better on mobile.

const PitchDeck = () => {
    return (
        <div className="aspect-w-16 aspect-h-9 overflow-auto">
            <iframe
                className="aspect-content  border-none"
                src="pitchdeck.pdf"
                width="100%"
                height="8000"
                style={{ border: "none" }}
            ></iframe>
        </div>
    );
};

export default PitchDeck;
