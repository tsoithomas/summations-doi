import Image from 'next/image'

export default function Nav() {
    // Navigation bar
    return (
    <nav className="bg-white border-gray-200 bg-gray-100 sticky top-0 z-20">
    <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        <a aria-label="Summations logo" className="flex items-center" href="/">
            <Image
                src="/summations.svg"
                alt="Summations Logo"
                id="logo"
                width={100}
                height={100}
                priority
                />
        </a>

        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
        </div>
    </div>
    </nav>
    );
}