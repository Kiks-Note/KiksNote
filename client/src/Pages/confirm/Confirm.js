function Confirm() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5050/users").then((res) => {
            getUsers(res.data);
        });
    }, []);

    if ({user_id} === user_id)
    {

    }

    setConfirm(() => {

    });

    return (
        <div>
            <p>Complété votre inscription en cliquant</p>
            <button onClick={() => setConfirm()}>Ici</button>
        </div>
    );
}

export default Confirm;