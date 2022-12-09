function Confirm() {

    const setConfirm = () => {
        console.log("test");
    };

    return (
        <div>
            <p>Complété votre inscription en cliquant</p>
            <button onClick={() => setConfirm()}>Ici</button>
        </div>
    );
}

export default Confirm;