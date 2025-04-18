import { useState } from "react";
import "./App.css";
import Router from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastCon } from "./components/common/Toast";
import { AuthProvider } from "./context/AuthProvider";
import swal from 'sweetalert';


function App() {
  return (
    // <AuthProvider>
    <ThemeProvider>
      <Router />
      <ToastCon />
    </ThemeProvider>
    //</AuthProvider>
  );
}

{
  /* <div className="bg-black/60 min-h-full">
  <Login/>
  </div> */
}
{
  /* <div className="container mx-auto p-4">
    <ThemeToggler />
  </div> */
}
{
  /*
    <div className="bg-pink-400">
      <button onClick={toggleModal} className="bg-green-500">Toggle Modal</button>

      {showModal && (
        <>
          <BackDrop showModal={showModal} setShowModal={setShowModal} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white p-4 z-50">
            <p>This is your modal content.</p>
            <button onClick={toggleModal} className="bg-green-500">Close Modal</button>
          </div>
        </>
      )}
    </div>
  </div>*/
}

export default App;
