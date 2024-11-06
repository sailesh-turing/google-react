function ModelA() {
    // Simulate localStorage not having the "pastes" key
    localStorage.removeItem("pastes");

    // Original (incorrect) code
    const initialStateOriginal = {
        pastes: localStorage.getItem("pastes")
            ? JSON.parse(localStorage.getItem("pastes"))
            : []
    };

    console.log("Original:", initialStateOriginal.pastes, typeof initialStateOriginal.pastes); // Outputs: Original: null object

    // Corrected code (using ??)
    const initialStateCorrected = {
        pastes: JSON.parse(localStorage.getItem("pastes") ?? "[]")
    };

    console.log("Corrected:", initialStateCorrected.pastes, typeof initialStateCorrected.pastes); // Outputs: Corrected: [] object


    // If something WAS in localStorage:
    localStorage.setItem("pastes", JSON.stringify([{ text: "example" }]));

    const initialStateWithStoredData = {
        pastes: JSON.parse(localStorage.getItem("pastes") ?? "[]")
    };
    console.log("With Data:", initialStateWithStoredData.pastes, typeof initialStateWithStoredData.pastes); //Outputs: With Data: [{…}] object

    return (
        <p>
            {"Model A"}
        </p>
    );
}

export default ModelA;
