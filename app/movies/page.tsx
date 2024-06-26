'use client';

import { useEffect, useState } from "react";

interface Content {
  $id: string,
  name: string,
  is_series: boolean,
  no_of_episodes: number | null,
  is_done: boolean
}

export default function Page(){

  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    const fetchContent = async() => {
      setIsLoading(true);
      const response = await fetch('api/movies/', {method: "GET"});
      if(!response.ok){
        setIsLoading(false);
        console.log("Error in fetching")
      }
      const data = await response.json();
      setContents(data);
      setIsLoading(false);
    };
    fetchContent();
  },[]);

  return(
    <div id="content">
      {isLoading 
      ? <p>Loading...</p>
    : (
      <table>
        <thead>
          <th>Name</th>
          <th>Type</th>
          <th>No of Episodes</th>
          <th>is Done</th>
        </thead>
        {contents.map((content, key) => {
          return (
            <tr key={key} aria-rowspan={5}>
              <td>{content.name}</td>
              <td>{content.is_series ? "Series" : "Movies"}</td>
              <td>{content.no_of_episodes ? content.no_of_episodes : "-"}</td>
              <td className={content.is_done ? "done" : "notDone"}><span>{content.is_done ? "Done" : "Not Done"}</span></td>
            </tr>
          )
        })}
      </table>
    )
    }
    </div>
  )
}