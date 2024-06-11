"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Home = () => {

  const router = useRouter()

  useEffect(() => {
    router.replace("/login")
  } , [])

  return (
    <div className="">
    </div>
  )
}

export default Home