'use client';

import { useEffect, useState } from "react";

interface Content {
  $id: string,
  name: string,
  is_series: boolean,
  no_of_episodes: number,
  is_done: boolean
}

export default function Page(){

  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    const fetchContent = async() => {
      setIsLoading(true);
      const response = await fetch('api/movies');
      if(!response.ok){
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      setContents(data);
      setIsLoading(false);
    };
    fetchContent();
  },[]);

  return(
    <>
      <h1>Movies</h1>
      {isLoading 
      ? <p>Loading...</p>
    : (
      <table border={2}>
        <thead>
          <th>Name</th>
          <th>Type</th>
          <th>No of Episodes</th>
          <th>is Done</th>
        </thead>
        {contents.map((content, key) => {
          return (
            <tr key={key}>
              <td>{content.name}</td>
              <td>{content.is_series ? "Series" : "Movies"}</td>
              <td>{content.no_of_episodes ? content.no_of_episodes : "-"}</td>
              <td>{content.is_done ? "Done" : "Not Done"}</td>
            </tr>
          )
        })}
      </table>
    )
    }
    </>
  )
}