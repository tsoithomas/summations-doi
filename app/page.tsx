import DoiInput from './DoiInput'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 md:px-24">
      <div className="relative flex grow"></div>
      <div className="relative flex w-full shrink max-w-5xl items-center justify-between font-mono text-sm">
        <h1>Summations</h1>
      </div>
      <div className="relative flex w-full grow place-items-center">
        <form className="w-full">
          <div className="my-2">
            <DoiInput />
          </div>
          <button class="bg-teal-500 hover:bg-teal-700 border text-white font-bold py-2 px-4 rounded inline-flex items-center cursor-pointer">
            <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
            <span>Retrieve</span>
          </button>
        </form>
      </div>
      <div className="relative flex grow"></div>
    </main>
  )
}
