'use client';
import { useEffect, useState } from "react";

interface Content {
  $id: string,
  name: string,
  type: string,
  no_of_episodes: number | null,
  is_done: boolean
}

export default function Page(){

  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedConetent] = useState<Content | null>(null);
  const [newAddContent, setNewAddContent] = useState<Content | null>(null);

  const fetchContent = async() => {
    setIsLoading(true);
    const response = await fetch('api/animation');
    if(!response.ok){
      setIsLoading(false);
      return;

    }
    setContents(await response.json());
    setIsLoading(false);
  }

  useEffect( () => {
    fetchContent();
  } ,[]);

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
    const response = await fetch(`/api/animation/${content.$id}`, {
      method: "PUT",
      headers: {"Conetent-type": "application-type"},
      body: JSON.stringify(newContent)

    });

    // console.log(newContent);
    
  }

  const handleDelete = async (id: string) => {
    setContents(contents.filter(content => {
      if (content.$id != id)
        return content;
    }));
    const response = await fetch(`api/animation/${id}`, {method: "DELETE"});
    if (!response.ok){
      console.log("Error in Deleting");
      return;
    }
  }

  const handleEditDone = async() => {
    setContents(contents.map(i => {
      if (i.$id === selectedContent?.$id)
        return selectedContent;
      else  
        return i;
    }));
    const response = await fetch(`api/animation/${selectedContent?.$id}`, {
      method: "PUT",
      headers: {"Content-type" : "application-type"},
      body: JSON.stringify(selectedContent)
    });
    setSelectedConetent(null);

  }

  const handleAddBtnClick = () => {
    if (newAddContent === null)
      setNewAddContent({name: "", $id: "", type:"Animation Series", is_done: false, no_of_episodes: 0});  
  }
  
  const handleAddDone = async () => {
    if (newAddContent?.name === ""){
      alert("Fill the Name Field!");
      return;
    }

    const response = await fetch(`api/animation`, {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(newAddContent)
    });


    setNewAddContent(null);
    fetchContent();

  }

  useEffect(() => {
    console.log(newAddContent);
  }, [newAddContent]);

  return (
    <div id="content">
      {isLoading 
      ? (<p>Loading...</p>)
      : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>No of Episodes</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contents?.map((content, key) => {
                return (
                  <tr key={key} aria-rowspan={5}>
                    {content.$id != selectedContent?.$id
                    ? (
                      <>
                        <td>{content.name}</td>
                        <td>{content.type}</td>
                        <td>{(content.type === "Animation Series" || content.type === "Anime Series") ? content.no_of_episodes : "-"}</td>
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
                          <select value={selectedContent.type} onChange={(e) => {
                            if ((e.target.value === "Animation Series" || e.target.value === "Anime Series"))
                              setSelectedConetent({...selectedContent, type: e.target.value, no_of_episodes: 0});
                            else
                              setSelectedConetent({...selectedContent, type: e.target.value, no_of_episodes: null});
                              
                              
                          }}>
                            <option>Animation Series</option>
                            <option>Animation Movies</option>
                            <option>Anime Series</option>
                            <option>Anime Movies</option>
                          </select>
                        </td>
                        <td>{(selectedContent.no_of_episodes !=  null && (content.type === "Animation Series" || content.type === "Anime Series")) ? (
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
                      if ((e.target.value === "Animation Series" || e.target.value === "Anime Series"))
                        setNewAddContent({...newAddContent, type: e.target.value, no_of_episodes: 0});
                      else
                      setNewAddContent({...newAddContent, type: e.target.value, no_of_episodes: null});
                       
                    }}>
                      <option>Animation Series</option>
                      <option>Animation Movies</option>
                      <option>Anime Series</option>
                      <option>Anime Movies</option>
                    </select>
                  </td>
                  <td>{(newAddContent.no_of_episodes !=  null && (newAddContent.type === "Animation Series" || newAddContent.type === "Anime Series")) ? (
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
      )}
    </div>
  )

}