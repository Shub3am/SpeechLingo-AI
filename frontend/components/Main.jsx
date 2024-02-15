"use client"
import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from "next/navigation";
export default function Main() {
    const router = useRouter()

  const [file, setFile] = useState(null)

  const onChangeHandler=event=>{
    setFile(event.target.files[0])
}
const onClickHandler = () => {
  const data = new FormData() 
  data.append('file', file)
  axios.post("http://localhost:8000/upload", data, {  
      })
      .then(res => {
        router.push("/translated")
      })
}
useEffect(()=> {
    if(file) {
  console.log(file, "file")}
},[file])
  return (

<div className="m-20">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-1xl lg:text-2xl dark:text-white">Get Started ( Only Translating First 30 Sec of Video )</h1>

            <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={onChangeHandler} name="file"/>
            
            <button type="button" onClick={onClickHandler} className="mt-3 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                Translate
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
                    <p className="mb-3 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-1xl lg:text-sm dark:text-white">Video Should be only in English Only</p>
        </div>
  )

}