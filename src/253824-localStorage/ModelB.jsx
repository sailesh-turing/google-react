function ModelB() {

    function getInitialState() {
        const initialState = {
            pastes: (() => {
                try {
                    return typeof window !== "undefined" && localStorage.getItem("pastes")
                        ? JSON.parse(localStorage.getItem("pastes"))
                        : [];
                } catch (error) {
                    console.error("Error parsing JSON from localStorage:", error);
                    return [];
                }
            })()
        };
        return initialState;
    }
    // Simulate localStorage not having the "pastes" key
    localStorage.removeItem("pastes");

    const initialStateOriginal = getInitialState();

    console.log("localStorage not having the 'pastes' key:", initialStateOriginal.pastes);

    // If something WAS in localStorage:
    localStorage.setItem("pastes", JSON.stringify([{ text: "example" }]));

    const initialStateWithStoredData = getInitialState();
    console.log("With Valid JSON Data:", initialStateWithStoredData.pastes);

    // If invalid JSON in localStorage:
    localStorage.setItem("pastes", "abc");

    const initialStateWithInvalidData = getInitialState();
    console.log("With invalid JSON Data:", initialStateWithInvalidData.pastes);

    return (
        <p>
            {"Model B"}
        </p>
    );
}

export default ModelB;
