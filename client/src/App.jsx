import axios from "axios";
import {UserContextProvider} from "./UserContext";
import Routes from "./Routes";

function App() {
  axios.defaults.baseURL = 'https://chat-api-8me2w.ondigitalocean.app/api';
  axios.defaults.withCredentials = true;
  return (
      <UserContextProvider>
    <Routes/>
      </UserContextProvider>
  )
}

export default App
