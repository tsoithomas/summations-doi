"use client";
import Nav from './components/Nav'
import DoiInput from './components/DoiInput'
import { useRef, useState } from 'react';

export default function Home() {
  const initialRef: any = null;
  const doiRef = useRef(initialRef);
  const [abstract, setAbstract] = useState({title: "", text: ""});
  const doiUrl = "https://doi.org/";
  const apiUrl = "https://api.openalex.org/works/" + doiUrl;

  // Retrieve button onClick handler
  const retrieveData = (e: any) => {
    // Prevent the browser from reloading
    e.preventDefault();

    // Remove DOI domain if present
    let doiValue = doiRef.current!.getDoiValue();
    if (doiValue.startsWith(doiUrl)) {
      doiValue = doiValue.substring(doiUrl.length);
      doiRef.current!.setDoiValue(doiValue);
    }

    // Fetch DOI data from OpenAlex
    fetch(apiUrl + doiValue)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        else {
          Promise.reject('error');
        }
      })
      .then((actualData) => {
        // Set up variables to recover abstract from abstract_inverted_index
        let glossary = actualData.abstract_inverted_index
        let words: Array<string> = []

        // Reverse the inverted index into an array
        for (let lexeme in glossary) {
          let indices = glossary[lexeme]
          for (let index of indices) {
            words[Number(index)] = lexeme;
          }
        }

        // Prepare state object
        let fetchedAbstract = {
          title: actualData.title,
          text: words.join(" ")
        }

        // Update state
        setAbstract(abstract => ({
          ...abstract,
          ...fetchedAbstract
        }));

        // Fade in abstract
        const article = document.getElementById('abstract');
        if (article != null) {
          article.classList.remove('opacity-0');
          article.classList.add('opacity-100');
        }

      })
      .catch((err) => {
        // Error message
        console.log(err.message);
      });

    // Fade out abstract
    const article = document.getElementById('abstract');
    if (article != null) {
      article.classList.remove('opacity-100');
      article.classList.add('opacity-0');
    }


  }




  return (
    <div>
      <Nav />
      <main className="flex min-h-screen flex-col items-center justify-between px-4 md:px-24 z-0">
        <div className="flex w-full max-w-screen-md grow-0 place-items-center mt-10 md:mt-20 mb-10">
          <form className="w-full">
            <div className="my-2">
              <DoiInput ref={doiRef} />
            </div>
            <button onClick={retrieveData} className="bg-blue-500 hover:bg-blue-700 border text-white font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer">
              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
              <span>Retrieve</span>
            </button>
          </form>
        </div>
        <div className="flex w-full max-w-screen-md grow place-items-start mb-6">
          <article id="abstract" className="opacity-0 bg-blue-200/75 bg-blend-screen w-full rounded py-5 px-6 md:px-10">
            <h2 className="font-bold text-xl mb-4 text-left">{abstract.title}</h2>
            <p className="text-justify text-sm">{abstract.text}</p>
          </article>
        </div>
      </main>
    </div>
  )
}
