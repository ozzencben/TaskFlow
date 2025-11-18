import { Toaster } from "react-hot-toast";
import AppRoute from "../routes/app/AppRoute";

function App() {
  return (
    <>
      <AppRoute />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
