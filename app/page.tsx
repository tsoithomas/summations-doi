"use client";
import Nav from './components/Nav';
import DoiInput from './components/DoiInput';
import { useRef, useState } from 'react';

export default function Home() {
  const initialRef: any = null;
  const doiRef = useRef(initialRef);
  const [errorMessage, setErrorMessage] = useState("Error");
  const [abstract, setAbstract] = useState({title: "", authors: "", text: ""});
  const doiUrl = "https://doi.org/";
  const apiUrl = "https://api.openalex.org/works/" + doiUrl;
  const doiSamples = ["10.7717/peerj.4375", 
                      "10.3352/jeehp.2013.10.3",
                      "10.1017/S1366728910000453",
                      "10.1103/PhysRev.55.374",
                      "10.1103/PhysRev.47.777",
                      "10.1109/MSPEC.2022.9754503"
                      ];

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

    // Fade out abstract and error
    const article = document.getElementById('abstract');
    if (article != null) {
      article.classList.remove('opacity-100');
      article.classList.add('opacity-0');
    }
    const errorDiv = document.getElementById('error');
    if (errorDiv != null) {
      errorDiv.classList.remove('opacity-100');
      errorDiv.classList.add('opacity-0');
    }

    if (doiValue != "") {

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
          let glossary = actualData.abstract_inverted_index;
          let words: Array<string> = [];

          // Reverse the inverted index into an array
          for (let lexeme in glossary) {
            let indices = glossary[lexeme]
            for (let index of indices) {
              words[Number(index)] = lexeme;
            }
          }

          let authorship: Array<string> = [];
          for (let author of actualData.authorships) {
            authorship.push(author.author.display_name);
          }

          // Prepare state object
          let fetchedData = {
            title: actualData.title,
            authors: authorship.join(", "),
            text: words.join(" ")
          }

          // Update state
          setAbstract(abstract => ({
            ...abstract,
            ...fetchedData
          }));

          // Fade in abstract
          const article = document.getElementById('abstract');
          if (article != null) {
            article.classList.remove('opacity-0');
            article.classList.add('opacity-100');
          }

        })
        .catch((err) => {
          // Fade in error message
          const errorDiv = document.getElementById('error');
          if (errorDiv != null) {
            setErrorMessage("The DOI is incorrect.")
            errorDiv.classList.remove('opacity-0');
            errorDiv.classList.add('opacity-100');
          }
        });
      }
    }

  const setRandomDOI = () => {
    // Pick a random DOI and set it to DoiInput
    let doiValue = doiRef.current!.getDoiValue();
    let chosenDOI = "";
    do {
      chosenDOI = doiSamples[Math.floor(Math.random() * doiSamples.length)]
    } while (doiValue == chosenDOI && doiSamples.length > 1);
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
            <span id="random" onClick={setRandomDOI} className="ms-2 text-sm hover:underline text-blue-900 hover:text-blue-700 cursor-pointer select-none">
              use random DOI
            </span>
          </form>
        </div>
        <div className="relative w-full max-w-screen-md grow place-items-start mb-6">

          <article id="abstract" className="relative opacity-0 bg-blue-200/75 bg-blend-screen w-full rounded py-5 px-6 md:px-10 z-10">
            <h2 className="font-bold text-xl mb-4 text-left">{abstract.title}</h2>
            <p className="text-left text-sm mb-4">{abstract.authors}</p>
            <p className="text-justify text-md font-serif">{abstract.text}</p>
          </article>

          <div id="error" className="absolute opacity-0 top-0 left-0 bg-red-100 w-full border border-red-400 text-red-700 text-sm px-4 py-3 rounded z-0" role="alert">
            {errorMessage}
          </div>


        </div>
      </main>
    </div>
  )
}
