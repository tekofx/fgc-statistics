import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from './Layout';
import TrainTable from './components/TrainTable';
import TimeChart from "./components/TimeChart.tsx";
import {createTheme, MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';

const theme = createTheme({});

const router = createBrowserRouter([
    {

        Component: Layout,
        children: [
            {
                index: true, Component: TrainTable
            },
            {path: "chart", Component: TimeChart},
        ]
    },
    {path: "/test", element: <p>Hola</p>}
])

createRoot(document.getElementById('root')!).render(
    <MantineProvider theme={theme} defaultColorScheme="dark">

        <RouterProvider router={router}/>
    </MantineProvider>
)
