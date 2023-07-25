import React from "react"

import { router as h5 } from './h5'
import { router as manage } from './manage'

type meta = {
    title?: string
    authority?: string
}
export type MyRouter = {
    path?: string
    id: string
    children?: MyRouter[]
    element?: React.ReactNode | null
    meta?: meta
    showNav?: boolean
}

export const router = [...h5, ...manage]