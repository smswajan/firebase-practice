import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { app } from "./base";
import { useState } from "react";
import { useEffect } from "react";

const db = app.firestore();

function App() {
    const [fileUrl, setFileUrl] = useState(null);
    const [users, setUsers] = useState([]);

    // OnFileChange
    const onFileChange = async (e) => {
        const file = e.target.files[0];
        const storageRef = app.storage().ref();
        const fileRef = storageRef.child(file.name);

        await fileRef.put(file);
        setFileUrl(await fileRef.getDownloadURL());
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        if (!username) {
            return;
        }
        db.collection("users").doc(username).set({
            name: username,
            avatar: fileUrl,
        });
    };
    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await db.collection("users").get();
            setUsers(
                usersCollection.docs.map((doc) => {
                    return doc.data();
                })
            );
        };
        fetchUsers();
    }, []);
    return (
        <>
            <div className="jumbotron">
                <h2 className="text-center mb-5">Practice React</h2>
                {/* Form Here */}
                <form onSubmit={onSubmit}>
                    <input
                        className=" mb-5"
                        type="file"
                        onChange={onFileChange}
                    />
                    <input
                        className="form-control"
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Name"
                    />
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
            <div className="container">
                <ul>
                    {users.map((user) => {
                        console.log(user);
                        return (
                            <li key={user.name}>
                                <img
                                    height="160px"
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <p>{user.name} </p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default App;
