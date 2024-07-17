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
  const [newAddContent, setNewAddContent] = useState<Content | null>(null);

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

  useEffect(()=> {
    
    fetchContent();
  },[]);

  const handleToggle = async (content: Content) => {
    const newContent = {...content, is_done: !content.is_done};
    setContents(contents.map(i => {
      if (i.$id != content.$id)
        return i;
      else {
        return newContent;
      }
    }));
    console.log(content.$id);
    const response = await fetch(`/api/movies/${content.$id}`, {
      method: "PUT",
      headers: {"Conetent-type": "application-type"},
      body: JSON.stringify(newContent)

    });

    // console.log(newContent);
    
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
    setContents(contents.filter(content => {
      if (content.$id != id)
        return content;
    }));
    const response = await fetch(`api/movies/${id}`, {method: "DELETE"});
    if (!response.ok){
      console.log("Error in Deleting");
      return;
    }
  }

  const handleAddBtnClick = () => {
    if (newAddContent === null)
      setNewAddContent({name: "", $id: "", is_series: false, is_done: false, no_of_episodes: null});  
  }
  
  const handleAddDone = async () => {
    if (newAddContent?.name === ""){
      alert("Fill the Name Field!");
      return;
    }

    const response = await fetch(`api/movies`, {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(newAddContent)
    });


    setNewAddContent(null);
    fetchContent();

  }

  return(
    <div id="content">
      {isLoading 
      ? <p>Loading...</p>
    : (
      <>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>No of Episodes</th>
              <th>Status</th>
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
                      <td>{content.is_series ? content.no_of_episodes : "-"}</td>
                      <td className={content.is_done ? "done" : "notDone"}><span onClick={() => handleToggle(content)}>{content.is_done ? "Done" : "Not Done"}</span></td>
                      <td>
                        <button className="editBtn" onClick={() => setSelectedConetent(content)}>Edit</button>
                        <button className="deleteBtn" onClick={() => handleDelete(content.$id)}>Delete</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <input className="nameInput" type="text" value={selectedContent.name} onChange={(e) => {
                        setSelectedConetent({...selectedContent, name: e.target.value})
                      }} />
                      </td>
                      <td>
                        <select onChange={(e) => {
                          if (e.target.value === "Movies") 
                            setSelectedConetent({...selectedContent, is_series: false, no_of_episodes: null});
                          else 
                            setSelectedConetent({...selectedContent, is_series: true, no_of_episodes: 0});
                        }}>
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
                      <td>{(selectedContent.no_of_episodes !=  null && selectedContent.is_series) ? (
                        <input type="number" className="numberOfEpisodesInput" value={selectedContent ? selectedContent?.no_of_episodes : 0} onChange={(e) => setSelectedConetent({...selectedContent, no_of_episodes: parseInt(e.target.value)})} />
                      ):  (
                        "-"
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
            {newAddContent ? (
              <tr>
                <td>
                    <input className="nameInput" type="text" value={newAddContent.name} onChange={(e) => {
                    setNewAddContent({...newAddContent, name: e.target.value})
                  }} />
                  </td>
                  <td>
                    <select onChange={(e) => {
                      if (e.target.value === "Movies")  
                        setNewAddContent({...newAddContent, is_series: false, no_of_episodes: null});
                      else  
                        setNewAddContent({...newAddContent, is_series: true, no_of_episodes: 0});

                    }}>
                      <option>Movies</option>
                      <option>Series</option>
                    </select>
                  </td>
                  <td>{(newAddContent.no_of_episodes !=  null && newAddContent.is_series) ? (
                    <input type="number" className="numberOfEpisodesInput" value={newAddContent ? newAddContent?.no_of_episodes : 0} onChange={(e) => setNewAddContent({...newAddContent, no_of_episodes: parseInt(e.target.value)})} />
                  ):  (
                    "-"
                  )}</td>
                  <td className={newAddContent.is_done ? "done" : "notDone"}><span onClick={() => setNewAddContent({...newAddContent, is_done: !(newAddContent.is_done)})}>{newAddContent.is_done ? "Done" : "Not Done"}</span></td>
                  <td>
                    <button className="doneBtn" onClick={handleAddDone}>Done</button>
                  </td>
              </tr>
            ) : (<></>)}
          </tbody>
        </table>
        <button className="addBtn" onClick={handleAddBtnClick}>+</button>
      </>
    )
    }
    </div>
  )
}