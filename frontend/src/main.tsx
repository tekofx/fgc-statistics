import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from './Layout';
import TrainTable from './components/TrainTable';
import TimeChart from "./components/TimeChart.tsx";
import {createTheme, MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import Home from "./components/Home.tsx";

const theme = createTheme({});

const router = createBrowserRouter([
    {

        Component: Layout,
        children: [
            {
                index: true, Component: Home
            },
            {
                path: "all-data",
                Component: TrainTable
            },
            {
                path: "chart",
                Component: TimeChart
            },
        ]
    },
])

createRoot(document.getElementById('root')!).render(
    <MantineProvider theme={theme} defaultColorScheme="dark">

        <RouterProvider router={router}/>
    </MantineProvider>
)
