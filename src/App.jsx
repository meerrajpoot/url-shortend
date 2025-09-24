import { ToastContainer } from "react-toastify";
import UrlForm from "./components/UrlForm";

function App() {
  return (
    <div>
      <UrlForm />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
