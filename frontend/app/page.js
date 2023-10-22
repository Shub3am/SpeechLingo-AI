"use client"
import { useEffect, useState } from "react"
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null)

  const onChangeHandler=event=>{
    setFile(event.target.files[0])
}
const onClickHandler = () => {
  const data = new FormData() 
  data.append('file', file)
  axios.post("http://localhost:8000/upload", data, { // receive two parameter endpoint url ,form data 
      })
      .then(res => { // then print response status
        console.log(res.statusText)
      })
}
useEffect(()=> {
  console.log(file, "file")
},[file])
  return (
<main> <input type="file" name="file" onChange={onChangeHandler}/>
<button type="button" class="btn btn-success btn-block" onClick={onClickHandler}>Upload</button> 

</main>
  )
}
