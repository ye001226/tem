import React, { lazy } from "react"
import { MyRouter } from "."
// import Main from "@/pages/main"
// import Contact from "@/pages/contact"
// import Login from "@/pages/login"
const Main = lazy(() => import('@/manage/main'))
const Home = lazy(() => import('@/manage/home'))
const Contact = lazy(() => import('@/manage/contact'))
const Login = lazy(() => import('@/manage/login'))
const ErrorPage = lazy(() => import('@/manage/error-page'))

export const router: MyRouter[] = [
    // 一级路由
    {
        path: '/manage',
        element: <Main />,
        id: 'main',
        // 二级路由
        children: [
            {
                path: '/manage/',
                element: <div>欢迎</div>,
                id: 'welcome',
                meta: {
                    title: '欢迎'
                },
                showNav: true
            },
            {
                path: '/manage/book',
                element: <Home />,
                id: 'home',
                meta: {
                    title: '首页'
                },
                showNav: true
            },
            {
                path: "/manage/contacts",
                element: <Contact />,
                id: 'contacts',
                meta: {
                    title: '联系人'
                },
                showNav: true
            },
            {
                path: "/manage/ce",
                id: 'contacts',
                meta: {
                    title: '测试'
                },
                showNav: true,
                children: [
                    {
                        path: "/manage/ce/one",
                        element: <div>测试1</div>,
                        id: 'contacts1',
                        meta: {
                            title: '测试1'
                        },
                        showNav: true,
                        children: [
                            {
                                path: "/manage/ce/one/two",
                                element: <div>测试2</div>,
                                id: 'contacts2',
                                meta: {
                                    title: '测试2'
                                },
                                showNav: true
                            },
                        ]
                    },
                    {
                        path: "/manage/ce/five",
                        element: <div>测试5</div>,
                        id: 'contacts5',
                        meta: {
                            title: '测试5'
                        },
                        showNav: true
                    },
                ]
            },
            {
                path: "/manage/error",
                element: <ErrorPage />,
                id: 'error',
                meta: {
                    title: '错误'
                }
            }
        ]
    },
    {
        path: '/manage/login',
        id: 'login',
        element: <Login />,
        meta: {
            title: '登录'
        }
    }
]