import React from 'react'

const HomeNavbar = () => {
    return (
            <nav className="sticky w-[70vw] top-0 z-10 bg-slate-400  backdrop-filter backdrop-blur-lg  bg-opacity-30 rounded-lg">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <span className="text-2xl text-gray-900 font-semibold">Logo</span>
                        <div className="flex space-x-4 text-gray-900">
                            <a href="#">Dashboard</a>
                            <a href="#">About</a>
                            <a href="#">Projects</a>
                            <a href="#">Contact</a>
                        </div>
                        <button></button>
                    </div>
                </div>
            </nav >


    )
}

export default HomeNavbar