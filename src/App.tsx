import GetStarted from "containers/GetStarted";
import IntegrateCosmos from "containers/IntegrateCosmos";
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div>
      <Routes>
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/cosmos" element={<IntegrateCosmos />} />
        <Route
          path="*"
          element={
            <>
              <button
                onClick={() => {
                  navigate("/get-started", {});
                }}
              >
                Get started
              </button>
              <button
                onClick={() => {
                  navigate("/cosmos", {});
                }}
              >
                Cosmos
              </button>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
