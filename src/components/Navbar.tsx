import { appleImg, bagImg, searchImg } from "../utils";
import { navLists } from "../constants";
import { useState } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={'w-full flex items-center justify-center pr-5 pl-5 pt-5'}>
            <nav className={"w-full flex screen-max-width relative"}>
                <div className="flex items-center gap-4">
                    <img src={appleImg} alt="apple" width={14} height={18} />
                    
                    {/* Hamburger Button - positioned right of Apple logo */}
                    <button
                        className="sm:hidden flex flex-col justify-center items-center w-6 h-6 cursor-pointer transition-all duration-300"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                    >
                        <span 
                            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMenuOpen ? 'rotate-45 [transform:translate(4px,-2px)] w-5' : 'mb-1'
                            }`}
                        />
                        <span 
                            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMenuOpen ? 'opacity-0' : 'mb-1'
                            }`}
                        />
                        <span 
                            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMenuOpen ? '-rotate-45 [transform:translate(4px,0px)] w-5' : ''
                            }`}
                        />
                    </button>
                </div>
                
                {/* Desktop Navigation */}
                <ul className={"flex flex-1 justify-center max-sm:hidden"}>
                    {navLists.map((nav: string) => (
                        <li 
                            key={nav}
                            className={'px-5 text-sm cursor-pointer text-gray hover:text-white transition-all'}
                        >
                            {nav}
                        </li>
                    ))}
                </ul>

                {/* Mobile Navigation Menu */}
                <div className={`
                    sm:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md
                    transition-all duration-300 ease-in-out z-50 mx-[-20px]
                    ${isMenuOpen 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible -translate-y-4'
                    }
                `}>
                    <ul className="flex flex-col py-4">
                        {navLists.map((nav: string) => (
                            <li 
                                key={nav}
                                className="px-5 py-3 text-sm cursor-pointer text-gray hover:text-white transition-all border-b border-gray-800 last:border-b-0"
                                onClick={closeMenu}
                            >
                                {nav}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className={'flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1'}>
                    <img src={searchImg} alt="search" width={18} height={18} />
                    <img src={bagImg} alt="bag" width={18} height={18} />
                </div>

                {/* Overlay to close menu when clicking outside */}
                {isMenuOpen && (
                    <div 
                        className="sm:hidden fixed inset-0 bg-black/30 z-40"
                        onClick={closeMenu}
                    />
                )}
            </nav>
        </header>
    );
};

export default Navbar;