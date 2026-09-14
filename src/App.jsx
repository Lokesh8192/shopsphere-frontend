import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">

          <Navbar />

          <main className="app-main">
            <AppRoutes />
          </main>

          <Footer />

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;