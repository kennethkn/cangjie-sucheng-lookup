import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import OutputCard from './OutputCard'

function App() {
  const [text, setText] = useState('')
  const [oldText, setOldText] = useState('')
  const [useSucheng, setUseSucheng] = useState(false)
  const [showChi, setShowChi] = useState(true)
  const [showEng, setShowEng] = useState(true)
  const [output, setOutput] = useState<string[][]>([])
  const [resetBtnClicked, setResetBtnClicked] = useState(false)
  const [UndoBtnCountdown, setUndoBtnCountdown] = useState(5)
  const [hideClearBtn, setHideClearBtn] = useState(false)
  const cangjieCodeMapRef = useRef<Map<string, string> | null>(null)
  const radicalMapRef = useRef<Map<string, string> | null>(null)
  const undoTimerRef = useRef<number | null>(null)

  const handleTextChange = useCallback(
    (e?: ChangeEvent<HTMLTextAreaElement>) => {
      const textareaVal = e ? e.target.value : text
      if (e) setText(textareaVal)
      const chars = textareaVal.split('')
      const newOutput: string[][] = []
      chars.forEach(c => {
        let cj
        try {
          cj = cangjieCodeMapRef.current!.get(
            c.charCodeAt(0).toString(16).toUpperCase()
          )
          if (typeof cj === 'undefined') throw new Error()
          if (useSucheng && cj.length > 1) cj = cj.charAt(0) + cj.slice(-1)
        } catch {
          // do nothing because it just means the char has no cangjie/sucheng code
        } finally {
          if (cj) {
            newOutput.push([
              c,
              showChi
                ? cj
                    .split('')
                    .map(ch => radicalMapRef.current!.get(ch.toLowerCase()))
                    .join('')
                : '',
              showEng ? cj : '',
            ])
          }
        }
      })
      setOutput(newOutput)
    },
    [showChi, showEng, useSucheng, text]
  )

  const handleResetBtnClicked = useCallback(() => {
    setResetBtnClicked(true)
    setOldText(text)
    setText('')
    document.getElementById('text')?.focus()
    let t = 5
    undoTimerRef.current = setInterval(() => {
      if (t === 1) {
        setResetBtnClicked(false)
        setUndoBtnCountdown(5)
        setHideClearBtn(true)
        clearInterval(undoTimerRef.current!)
      } else {
        setUndoBtnCountdown(--t)
      }
    }, 1000)
  }, [text])

  const handleUndoBtnClicked = useCallback(() => {
    setText(oldText)
    setUndoBtnCountdown(5)
    setResetBtnClicked(false)
    clearInterval(undoTimerRef.current!)
  }, [oldText])

  useEffect(() => {
    Promise.all([
      fetch('data/cangjie-codes.json'),
      fetch('data/radical-mapping.json'),
    ])
      .then(([r1, r2]) => {
        if (r1.ok && r2.ok) return Promise.all([r1.json(), r2.json()])
        else throw new Error()
      })
      .then(([json1, json2]: string[]) => {
        cangjieCodeMapRef.current = new Map(Object.entries(json1))
        radicalMapRef.current = new Map(Object.entries(json2))
      })
      .then(() => setText('打字喺度，對應嘅倉頡或速成碼就會喺下邊顯示！'))
      .catch(error => console.error(error))
  }, [])

  useEffect(() => {
    handleTextChange()
    if (text === '' && !resetBtnClicked) setHideClearBtn(true)
    else setHideClearBtn(false)
  }, [useSucheng, showChi, showEng, text, resetBtnClicked, handleTextChange])

  return (
    <div className="flex h-auto min-h-screen justify-center bg-white px-7 pb-7 text-neutral-900 dark:bg-black dark:text-neutral-300 sm:px-10 sm:pb-10">
      <div className="flex w-full flex-col">
        <div className="flex justify-end space-x-2 pt-2 text-sm dark:font-thin">
          <a href="https://github.com/kennethkn" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              className="mr-1 dark:fill-white">
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
            kennethkn
          </a>
          <a
            href="https://www.linkedin.com/in/kenneth-kwan-6bb396262"
            className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              className="mr-1 dark:fill-white">
              <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
            </svg>
            Kenneth Kwan
          </a>
          <a
            href="mailto:kennethhohinkwan@gmail.com"
            className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              className="mr-1 dark:fill-white">
              <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg>
            Email
          </a>
        </div>
        <div className="mb-3 mt-5 flex justify-center font-mono text-2xl lg:mb-4">
          Chinese to Cangjie/Sucheng <br className="lg:hidden" />
          Converter (C2CJ/SC)
        </div>
        <div className="sticky top-0 flex justify-between bg-white pb-1 pt-1 dark:bg-black lg:h-9">
          <div className="flex flex-col pl-0.5 lg:flex-row lg:space-x-3">
            <label htmlFor="use-sucheng" className="flex items-center">
              <input
                type="checkbox"
                id="use-sucheng"
                className="mr-1"
                onChange={() => setUseSucheng(!useSucheng)}></input>
              Use Sucheng/Quick
            </label>
            <label htmlFor="show-chi" className="flex items-center">
              <input
                type="checkbox"
                id="show-chi"
                className="mr-1"
                onChange={() => setShowChi(!showChi)}
                defaultChecked></input>
              Show Chinese Code
            </label>
            <label htmlFor="show-eng" className="flex items-center">
              <input
                type="checkbox"
                id="show-eng"
                className="mr-1"
                onChange={() => setShowEng(!showEng)}
                defaultChecked></input>
              Show English Code
            </label>
          </div>
          <button
            className={
              'h-7 border-2 px-1 font-bold dark:bg-neutral-900 ' +
              (resetBtnClicked
                ? 'w-[5.25rem] border-blue-500 bg-blue-50 text-blue-500 hover:border-blue-700 active:bg-blue-100 dark:border-blue-800 dark:text-blue-700 dark:hover:border-blue-700 dark:active:bg-blue-950'
                : 'border-red-500 bg-red-50 text-red-500 hover:border-red-700 active:bg-red-100 dark:border-red-800 dark:text-red-700 dark:hover:border-red-700 dark:active:bg-red-950') +
              (hideClearBtn ? ' hidden' : '')
            }
            onClick={
              resetBtnClicked ? handleUndoBtnClicked : handleResetBtnClicked
            }>
            {resetBtnClicked ? `Undo (${UndoBtnCountdown})` : 'Clear'}
          </button>
        </div>
        <textarea
          aria-label="Chinese text to be converted"
          onChange={handleTextChange}
          value={text}
          className="sticky top-20 mb-2 h-36 overscroll-contain rounded-none border-2 bg-neutral-50 p-1 shadow-md focus:border-neutral-900 focus:outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:shadow-neutral-900 dark:focus:border-neutral-300 dark:focus:shadow-neutral-600 sm:mb-1 lg:top-9"
          id="text"
          autoFocus></textarea>
        <div className="grid grid-cols-3 gap-2 sm:pt-1 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12">
          {output.map((c, idx) => (
            <OutputCard key={idx} output={c}></OutputCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
