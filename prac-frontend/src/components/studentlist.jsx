import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({ name: "", phoneNo: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:2408/studentcrudoperations");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const saveStudent = async () => {
    try {
      const { name, phoneNo } = student;
      if (!name || !phoneNo) {
        alert("Please fill in all fields.");
        return;
      }

      if (editMode) {
        await axios.put(`http://localhost:2408/studentcrudoperations/${editId}`, {
          name,
          phoneNo,
        });
      } else {
        await axios.post("http://localhost:2408/studentcrudoperations", {
          name,
          phoneNo,
        });
      }

      setStudent({ name: "", phoneNo: "" });
      setEditMode(false);
      setEditId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error.response?.data || error.message);
    }
  };

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:2408/studentcrudoperations/${id}`);
    fetchStudents();
  };

  const editStudent = (s) => {
    setStudent({ name: s.name, phoneNo: s.phoneNo });
    setEditMode(true);
    setEditId(s.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Manager</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={student.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phoneNo"
          placeholder="Phone No"
          value={student.phoneNo}
          onChange={handleChange}
        />
        <button onClick={saveStudent}>
          {editMode ? "Update" : "Add"}
        </button>
        {editMode && (
          <button
            onClick={() => {
              setStudent({ name: "", phoneNo: "" });
              setEditMode(false);
              setEditId(null);
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <h3>Student List</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.phoneNo}</td>
              <td>
                <button onClick={() => editStudent(s)}>Edit</button>
                <button onClick={() => deleteStudent(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
