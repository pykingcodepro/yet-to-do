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

  const [contents, setContents] = useState<Content[]>([]);
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
  };

  const handleToggle = async (content: Content) => {
    const newContent = {...content, is_done: !content.is_done};
    setContents(contents.map(i => {
      if (i.$id != content.$id)
        return i;
      else {
        return newContent;
      }
    }));
    const response = await fetch(`/api/books/${content.$id}`, {
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
    const response = await fetch(`api/books/${id}`, {method: "DELETE"});
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
    const response = await fetch(`api/books/${selectedContent?.$id}`, {
      method: "PUT",
      headers: {"Content-type" : "application-type"},
      body: JSON.stringify(selectedContent)
    });
    setSelectedContent(null);

  };

  const handleAddBtnClick = () => {
    if (newAddContent === null)
      setNewAddContent({name: "", $id: "", author:"", is_done: false, no_of_pages: 0});  
  };
  
  const handleAddDone = async () => {
    if (newAddContent?.name === ""){
      alert("Fill the Name Field!");
      return;
    }

    const response = await fetch(`api/books`, {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(newAddContent)
    });


    setNewAddContent(null);
    fetchContent();

  };

  useEffect(() => {
    fetchContent();
  }, []);


  return (
    <>
      <div id="content">
        {isLoading
        ? (<p>Loading...</p>)
      : (
        <>
          <table>
            <thead>
                <tr>
                  <th>Name</th>
                  <th>Author</th>
                  <th>No of Pages</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contents?.map((content, key) => {
                  return (
                    <tr key={key}>
                      {selectedContent?.$id != content.$id
                      ? (
                        <>
                          <td>{content.name}</td>
                          <td>{content.author}</td>
                          <td>{content.no_of_pages}</td>
                          <td className={content.is_done ? "done" : "notDone"}><span onClick={() => handleToggle(content)}>{content.is_done ? "Done" : "Not Done"}</span></td>
                          <td>
                            <button className="editBtn" onClick={() => setSelectedContent(content)}>Edit</button>
                            <button className="deleteBtn" onClick={() => handleDelete(content.$id)}>Delete</button>
                          </td>
                        </>
                      ): (
                        <>
                          <td>
                            <input className="nameInput" type="text" value={selectedContent.name} onChange={(e) => {
                            setSelectedContent({...selectedContent, name: e.target.value})
                          }} />
                          </td>
                          <td>
                            <input className="nameInput" type="text" value={selectedContent.author} onChange={(e) => {
                            setSelectedContent({...selectedContent, author: e.target.value})
                          }} />
                          </td>
                          <td>
                            <input type="number" className="numberOfEpisodesInput" value={selectedContent.no_of_pages} onChange={(e) => setSelectedContent({...selectedContent, no_of_pages: parseInt(e.target.value)})} />
                          </td>
                          <td className={content.is_done ? "done" : "notDone"}><span onClick={() => handleToggle(content)}>{content.is_done ? "Done" : "Not Done"}</span></td>
                          <td>
                            <button className="doneBtn" onClick={handleEditDone}>Done</button>
                            <button className="deleteBtn" onClick={() => handleDelete(content.$id)}>Delete</button>
                          </td>
                        </>
                      )}
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
                    <input className="nameInput" type="text" value={newAddContent.author} onChange={(e) => {
                    setNewAddContent({...newAddContent, author: e.target.value})
                  }} />
                  </td>
                  <td>
                  <input type="number" className="numberOfEpisodesInput" value={newAddContent.no_of_pages} onChange={(e) => setNewAddContent({...newAddContent, no_of_pages: parseInt(e.target.value)})} />
                  </td>
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
    </>
  )

}