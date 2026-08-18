import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/layout";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const myRouter = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "about",
                element: <About />
            },
						{
							path: "*",
							element: <NotFound />
						},
        ]
    }
])
 export default myRouter