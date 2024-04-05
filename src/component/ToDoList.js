
import { useState, useEffect } from "react";
import { Button, Container, Nav, Pagination, Table } from "react-bootstrap";
import Axios from "axios";

function ToDoList() {
    const [task, setTask] = useState({});
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);

    useEffect(() => {
        getData();
    }, []);


    const getData = () => {
        Axios.get("http://localhost:3000/tasks")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getinputvalue = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setTask({ ...task, [name]: value });
    };

    const isValidDate = (dateString) => {
        const datetype = /^\d{2}-\d{2}-\d{4}$/;
        return datetype.test(dateString);
    }

    const getsubmitvalue = (e) => {
        e.preventDefault();

        if (!task.username) {
            alert("Please Enter Username");
            return;
        }
        else if(!task.date){
            alert("Please Enter Date");
            return;
        }
        else if (!isValidDate(task.date)) {
            alert("Please enter a valid date in format DD-MM-YYYY");
            return;
        }
        else if (!task.message) {
            alert("Please Enter Message");
            return;
        }
        else if(task.message.length < 3){
            alert("Message must be 3 or more caracter is required");
            return;
        }
        else{

            Axios.post("http://localhost:3000/tasks", task)
                .then(() => {
                    setTask({});
                    getData();
                    alert("Data Submit");
                })
                .catch((err) => {
                    console.log(err);
                });
            console.log(task);
        }

    }

    const deleteData = (id) => {
        Axios.delete(`http://localhost:3000/tasks/${id}`)
            .then(() => {
                getData();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleTaskCompletion = (id) => {
        const updatedData = data.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setData(updatedData);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleSorting = () => {
        const sortedData = [...data];
        if (sortOrder === "asc") {
            sortedData.sort((a, b) => (a.username > b.username ? 1 : -1));
            setSortOrder("desc");
        } else {
            sortedData.sort((a, b) => (a.username < b.username ? 1 : -1));
            setSortOrder("asc");
        }
        setData(sortedData);
    };

    const filteredData = data.filter((item) =>
        item.username.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    function getColor(taskType) {
        switch (taskType) {
            case 'Office':
                return 'linear-gradient(60deg,#ff5757,white)';
            case 'Personal':
                return 'linear-gradient(60deg,yellow,white)';
            case 'Family':
                return 'linear-gradient(60deg,green,white)';
            case 'Friends':
                return 'linear-gradient(60deg,cyan,white)';
            default:
                return 'linear-gradient(60deg,grey,white)';
        }
    }

    return (
        <div>
            <h2 className="m-3" style={{ color: "skyblue" }}>-- To Do List --</h2>
            <Container>
                <form method="post" onSubmit={(e) => getsubmitvalue(e)}>
                    <Table bordered hover responsive striped variant="info" className="w-50 border-dark rounded mx-auto ">
                        <tbody>
                            <tr>
                                <td className="text-end">Enter Username :</td>
                                <td><input className="text-capitalize" type="text" name="username" placeholder="Write Your Name" value={task.username ? task.username : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end">Enter Date :</td>
                                <td><input type="text" name="date" placeholder="Write a Date" value={task.date ? task.date : ""} onChange={(e) => getinputvalue(e)} /></td>
                            </tr>
                            <tr>
                                <td className="text-end">Select Task Type :</td>
                                <td>
                                    <select name="taskType" value={task.taskType ? task.taskType : ""} onChange={(e) => getinputvalue(e)} >
                                        <option defaultChecked value="">--Select Type--</option>
                                        <option value="Office">Office</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Family">Family</option>
                                        <option value="Friends">Friends</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-end">Enter Your Task :</td>
                                <td><textarea name="message" cols="25" rows="2" placeholder="Write Your Task" value={task.message ? task.message : ""} onChange={(e) => getinputvalue(e)}></textarea></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><Button type="submit" variant="success">Add Task</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                </form><br />


                <h2 className="m-3" style={{ color: "skyblue" }}>-- View Task --</h2>
                <div className="colorbox">
                    <div className="color">
                        <span style={{ background: "linear-gradient(60deg,#ff5757,white)" }}></span>
                        <h4 style={{ color: "#ff5757" }}>Office</h4>
                    </div>
                    <div className="color">
                        <span style={{ background: "linear-gradient(60deg,yellow,white)" }}></span>
                        <h4 style={{ color: "yellow" }}>Personal</h4>
                    </div>
                    <div className="color">
                        <span style={{ background: "linear-gradient(60deg,green,white)" }}></span>
                        <h4 style={{ color: "green" }}>Family</h4>
                    </div>
                    <div className="color">
                        <span style={{ background: "linear-gradient(60deg,cyan,white)" }}></span>
                        <h4 style={{ color: "cyan" }}>Friends</h4>
                    </div>
                    <div className="color">
                        <span style={{ background: "linear-gradient(60deg,grey,white)" }}></span>
                        <h4 style={{ color: "grey" }}>Other</h4>
                    </div>
                    <div className="color">
                        <span style={{ background: "black" , border:"1px solid white"}}></span>
                        <h4 style={{ color: "white"}}>Completed</h4>
                    </div>
                </div>


                <div className="d-flex justify-content-evenly mb-4">
                    <div>
                        <input type="text" placeholder="Search By Name.." style={{ width: "300px" }} className="px-3 p-2 ms-2  d-flex rounded" name="Search" value={search} onChange={handleSearch} />
                    </div>
                    <div>
                        <Nav className="mx-auto m-0 border border-2 bg-light rounded">
                            <button onClick={handleSorting} className="btn-primary btn" title="⇵ Sorting User">Sorting Name ⇵ </button>
                        </Nav>
                    </div>
                </div>


                <div className="showtask">
                    {currentPosts.map((v, i) => {
                        return (
                            <div key={i} className="box" style={{ background: `${v.completed ? 'black' : getColor(v.taskType)}`, color: `${v.completed ? 'white' : 'black'}`, textShadow: `${v.completed ? 'none' : ''}` }}>
                                <button className="deletebtn btn" onClick={() => deleteData(v.id)} title="Delete">❌</button>
                                <span className="taskcheck">{v.completed ? 'Completed' : 'Pending'}</span>
                                <input type="checkbox" className="checkbox" onChange={() => handleTaskCompletion(v.id)} checked={v.completed} />
                                <br />
                                <div className="d-flex align-items-center justify-content-around text-capitalize">
                                    <h5 className="mx-2"><b>Name :</b> {v.username}</h5>
                                    <h5 className="ms-2"><b>Type :</b> {v.taskType}</h5>
                                </div>
                                <h5 style={{ fontSize: "20px", textAlign: "center", margin: "10px" }}>◆ Description ◆</h5>
                                <p>{v.message}</p>
                                <h6 className="text-start ms-3 mb-2 position-absolute start-0 bottom-0 "><b>Date :</b> {v.date}</h6>
                            </div>
                        );
                    })}
                </div>
                <Pagination className="justify-content-center mt-3">
                    {pageNumbers.map(number => (
                        <Pagination.Item key={number} onClick={() => paginate(number)} active={number === currentPage}>
                            {number}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </Container>
        </div>
    );
}

export default ToDoList;