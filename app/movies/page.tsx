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
  const [selectedContent, setSelectedConetent] = useState<Content | null>(null);

  useEffect(()=> {
    const fetchContent = async() => {
      setIsLoading(true);
      const response = await fetch('api/movies/', {method: "GET"});
      if(!response.ok){
        setIsLoading(false);
        console.log("Error in fetching");
        setContents([]);
        return;

      }
      const data = await response.json();
      setContents(data);
      setIsLoading(false);

      // For Development only
      // setContents([
      //   {
      //     $id: "123",
      //     name: "TBBT S2",
      //     is_series: true,
      //     no_of_episodes: 22,
      //     is_done: true
      //   },
      //   {
      //     $id: "456",
      //     name: "The Batman",
      //     is_series: false,
      //     no_of_episodes: null,
      //     is_done: false
      //   }
      // ]);
      // setIsLoading(false);

    };
    fetchContent();
  },[]);

  const handleToggle = async (content: Content) => {
    const newContent = {...content, is_done: !content.is_done};
    const response = await fetch(`/api/movies/${content.$id}`, {
      method: "PUT",
      headers: {"Conetent-type": "application/json"},
      body: JSON.stringify(newContent)

    });
    // console.log(newContent);
    setContents(contents.map(i => {
      if (i.$id != content.$id)
        return i;
      else {
        return newContent;
      }
    }))
  }

  const handleEditDone = async() => {
    const response = await fetch(`./api/movies/${selectedContent?.$id}`, {
      method: "PUT",
      headers: {"Content-type": "application-type"},
      body: JSON.stringify(selectedContent),
    });
    setContents(contents.map(content =>{
      if (content.$id != selectedContent?.$id)
        return content;
      else
        return selectedContent;
    }));
    setSelectedConetent(null);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`api/movies/${id}`, {method: "DELETE"});
    if (!response.ok){
      console.log("Error in Deleting");
      return;
    }
    setContents(contents.filter(content => {
      if (content.$id != id)
        return content;
    }));
  }

  return(
    <div id="content">
      {isLoading 
      ? <p>Loading...</p>
    : (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>No of Episodes</th>
            <th>is Done</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content, key) => {
            return (
              <tr key={key} aria-rowspan={5}>
                {content.$id != selectedContent?.$id
                ? (
                  <>
                    <td>{content.name}</td>
                    <td>{content.is_series ? "Series" : "Movies"}</td>
                    <td>{content.no_of_episodes ? content.no_of_episodes : "-"}</td>
                    <td className={content.is_done ? "done" : "notDone"}><span onClick={() => handleToggle(content)}>{content.is_done ? "Done" : "Not Done"}</span></td>
                    <td>
                      <button className="editBtn" onClick={() => setSelectedConetent(content)}>Edit</button>
                      <button className="deleteBtn" onClick={() => handleDelete(content.$id)}>Delete</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td><input className="nameInput" type="text" value={selectedContent.name} onChange={(e) => {
                      setSelectedConetent({...selectedContent, name: e.target.value})
                    }} /></td>
                    <td>
                      <select>
                      {content.is_series 
                      ? (
                        <>
                          <option>Series</option>
                          <option>Movies</option>
                        </>
                      ) : (
                        <>
                          <option>Movies</option>
                          <option>Series</option>
                        </>
                      )}
                      </select>
                    </td>
                    <td>{selectedContent.no_of_episodes ? (
                      <input type="number" value={selectedContent ? selectedContent?.no_of_episodes : 0} onChange={(e) => setSelectedConetent({...selectedContent, no_of_episodes: parseInt(e.target.value)})} />
                    ):  (
                      <input type="number" value={0} onChange={(e) => setSelectedConetent({...selectedContent, no_of_episodes: parseInt(e.target.value)})} />
                    )}</td>
                    <td className={content.is_done ? "done" : "notDone"}><span onClick={() => handleToggle(content)}>{content.is_done ? "Done" : "Not Done"}</span></td>
                    <td>
                      <button className="doneBtn" onClick={handleEditDone}>Done</button>
                      <button className="deleteBtn" onClick={() => handleDelete(content.$id)}>Delete</button>
                    </td>
                  </>
                )
                }
              </tr>
            )
          })}
        </tbody>
      </table>
    )
    }
    </div>
  )
}