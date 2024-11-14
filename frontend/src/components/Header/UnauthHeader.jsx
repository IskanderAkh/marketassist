import { MenuIcon, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import logo from "@/assets/images/logo.svg"
const UnauthHeader = () => {
    return (
        <div className={`navbar bg-base-100 z-[50] relative`}>
            <div className="navbar-start">
                <Link to="/" className="header-logo manrope-bold">
                    <img src={logo} alt="" />
                </Link>
            </div>

            <div className="navbar-end flex items-center space-x-4 ">
                <div className='justify-between w-full items-center flex text-center'>
                    <Link to="/questions" className="poppins-medium">
                        <div className="">
                            Вопросы
                        </div>
                    </Link>
                    <Link to="/contact" className="poppins-medium">
                        <div className="">
                            Контакты
                        </div>
                    </Link>
                    <Link to="/auth" className="poppins-bold navbar-end-auth flex items-center">
                        <div className='relative w-full h-full flex items-center justify-center'>
                            <div className='navbar-end-auth-circle'>
                                <div className='header-btn flex items-center justify-center'>
                                    Вход
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default UnauthHeader