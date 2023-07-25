"use client";
import Nav from './components/Nav'
import DoiInput from './components/DoiInput'
import { useRef } from 'react';

export default function Home() {
  const doiRef = useRef();

  const retrieveData = (e: any) => {
    e.preventDefault();
    const doiValue = doiRef.current!.getDoiValue();
    console.log('You clicked submit. ' + doiValue);
  }

  return (
    <div>
      <Nav />
      <main className="flex min-h-screen flex-col items-center justify-between px-6 md:px-24">
        <div className="flex w-full max-w-screen-xl grow place-items-center">
          <form className="w-full">
            <div className="my-2">
              <DoiInput ref={doiRef} />
            </div>
            <button onClick={retrieveData} className="bg-teal-500 hover:bg-teal-700 border text-white font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer">
              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
              <span>Retrieve</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
