import axios from "axios";
import {UserContextProvider} from "./UserContext";
import Routes from "./Routes";

function App() {
  axios.defaults.baseURL = process.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials = true;
  return (
      <UserContextProvider>
    <Routes/>
      </UserContextProvider>
  )
}

export default App
