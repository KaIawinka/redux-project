import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Panel from "./pages/message";
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
                    path: "message",
                    element: <Panel />
                },
						{
							path: "*",
							element: <NotFound />
						},
        ]
    }
])
 export default myRouter