const PitchDeck= () => {
    return (
        <div className="aspect-w-16 aspect-h-9 overflow-auto">
            <iframe 
                className="aspect-content  border-none"
                src="pitchdeck.pdf" 
                width="100%" 
                height="1000"
                style={{ border: 'none' }}>
            </iframe>
        </div>
    );
};
  

export default PitchDeck;
