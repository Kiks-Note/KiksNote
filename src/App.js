import FirebaseContextProvider from "./config/firebase";
import RoutesProvider from "./Routes";

function App() {
  return (
    <FirebaseContextProvider>
      <RoutesProvider />
    </FirebaseContextProvider>
  );
}

export default App;
