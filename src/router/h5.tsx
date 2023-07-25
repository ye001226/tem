import React, { lazy } from "react"
import { MyRouter } from "."
const Main = lazy(() => import('@/h5/main'))

export const router: MyRouter[] = [
    // 一级路由
    {
        path: '/',
        element: <Main />,
        id: 'main',
    }
]