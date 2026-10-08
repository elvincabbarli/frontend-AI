import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { routes } from "./routes";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
