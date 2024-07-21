'use client'
import { useEffect, useState } from "react"

interface Content {
  $id: string,
  name: string,
  author: string,
  no_of_pages: number,
  is_done: boolean
}

export default function Page(){

  const [contents, setContents] = useState<Content[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [newAddContent, setNewAddContent] = useState<Content | null>(null);

  const fetchContent = async() => {
    setIsLoading(true);
    const response = await fetch("api/books");
    if (!response.ok){
      setIsLoading(false);
      return;
    }
    const data = await response.json();
    setContents(data);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchContent();
  }, []) ;

  useEffect(() => {
    console.log(contents);
  }, [contents]);


  return (
    <>
      <div id="content">
        {isLoading
        ? (<p>Loading...</p>)
      : (
        <>
          <table></table>
          <button className="addBtn">+</button>
        </>
      )}
      </div>
    </>
  )

}