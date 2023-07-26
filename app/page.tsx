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
  const doiSamples = ["10.7717/peerj.4375", "10.3352/jeehp.2013.10.3"];

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
          return Promise.reject('404');
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
        console.log("error: " + err);
      });

    // Fade out abstract
    const article = document.getElementById('abstract');
    if (article != null) {
      article.classList.remove('opacity-100');
      article.classList.add('opacity-0');
    }
  }

  const setRandomDOI = () => {
    // Pick a random DOI and set it to DoiInput
    let chosenDOI = doiSamples[Math.floor(Math.random() * doiSamples.length)]
    doiRef.current!.setDoiValue(chosenDOI);
  }



  return (
    <div>
      <Nav />
      <main className="flex min-h-screen flex-col items-center justify-between px-4 md:px-24 z-0">
        <div className="flex w-full max-w-screen-md grow-0 place-items-center mt-10 md:mt-20 mb-10">
          <form className="w-full">
            <div className="flex flex-col md:flex-row my-2">
              <div className="flex grow">
                <DoiInput ref={doiRef} />
              </div>
              <div className="flex grow-0 ms-0 md:ms-3 pt-4">
                <button onClick={retrieveData} className="bg-blue-500 hover:bg-blue-700 border text-white font-bold py-0 px-4 h-9 rounded-lg inline-flex items-center cursor-pointer">
                  <span>Retrieve</span>
                  <svg className="fill-current w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                </button>
              </div>
            </div>
            <span id="random" onClick={setRandomDOI} className="ms-2 text-sm hover:underline text-blue-900 hover:text-blue-700 cursor-pointer">
              use random DOI
            </span>
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
