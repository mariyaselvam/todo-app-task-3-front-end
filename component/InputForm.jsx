import { useEffect, useState } from "react";
import Header from "./Header";
import menu from "../assets/todo-cards/menus.svg";

const InputForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingID, setEditingID] = useState(-1);
  const [input, showInput] = useState("");

  // For edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "https://squash-apps-taks3-new-1.onrender.com";

  // Fetch Todos
  const fetchTodos = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) =>
        console.error("Failed to fetch todos:", error.message)
      );
  };

  // Submit a new todo
  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unable to create Todo item");
          return res.json();
        })
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setTitle("");
          setDescription("");
          setMessage("Item added successfully");
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => setError("Unable to create Todo item"));
    } else {
      setError("Title and description are required");
    }
  };

  // Update a todo
  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editingID, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update item");
          return res.json();
        })
        .then(() => {
          fetchTodos(); // Refresh todos
          setMessage("Item updated successfully");
          setTimeout(() => setMessage(""), 3000);
          setEditingID(-1);
        })
        .catch(() => setError("Unable to update Todo item"));
    } else {
      setError("Title and description are required");
    }
  };

  // Delete a todo
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(apiUrl + "/todos/" + id, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete item");
          fetchTodos(); // Refresh todos
        })
        .catch(() => setError("Unable to delete Todo item"));
    }
  };

  // Cancel edit
  const editCancel = () => {
    setEditingID(-1);
    setEditTitle("");
    setEditDescription("");
  };

  // Begin editing a todo
  const handleEdit = (item) => {
    setEditingID(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  useEffect(() => {
    fetchTodos(); // Initial fetch
  }, []);

  return (
    <>
      <div className="input-from">
        <Header />

        <section className="secondary-header">
          <div className="secondary-header-container">
            <div className="board-view-and-add-view">
              <span className="Board-view-span">Board view</span>
              <span
                onClick={() => showInput(!input)}
                className={`Add-view-span ${input}`}
              >
                Add view
              </span>
              {message && <p className="good-response">{message}</p>}

              <input
                className="title-input"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Title"
                required
              />
              <input
                className="description-input"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                type="text"
                placeholder="Description"
                required
              />
              <button onClick={handleSubmit} className="add-btn">
                Add
              </button>

              {error && <p className="bad-response">{error}</p>}
            </div>
          </div>
        </section>

        <div className="todo-cards-container">
          {todos.map((item) => (
            <div key={item._id} className="to-do-listing-card-sec">
              <div className="to-do-listing-card-menu">
                <img src={menu} alt="" />
                <div className="menu-options">
                  {editingID === -1 || editingID !== item._id ? (
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button className="update-btn" onClick={handleUpdate}>
                      Update
                    </button>
                  )}

                  {editingID === -1 ? (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button className="cancel-btn" onClick={editCancel}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="to-do-listing-card">
                {editingID === -1 || editingID !== item._id ? (
                  <>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <div className="to-do-listing-card-progress-bar">
        <span className="Progress-tit">Progress</span>

        <span className="progress-10">7/10</span>
        
        <div className="progress-bar-range">

        </div>
        </div>
                  </>
                ) : (
                  <div>
                    <input
                      onChange={(e) => setEditTitle(e.target.value)}
                      value={editTitle}
                      type="text"
                      placeholder="Title"
                    />
                    <input
                      onChange={(e) => setEditDescription(e.target.value)}
                      value={editDescription}
                      type="text"
                      placeholder="Description"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InputForm;
