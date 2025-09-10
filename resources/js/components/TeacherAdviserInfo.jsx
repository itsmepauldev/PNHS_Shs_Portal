import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdviserTeacher() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    dob: '',
    age: '',
    nationality: '',
    religion: '',
    address: '',
    contact_number: '',
    position: '',
    password: '',
    password_confirmation: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'teacher' && user.role !== 'adviser')) {
      navigate('/login');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (form.password !== form.password_confirmation) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
     await axios.put(`http://shs-portal.test/api/teacher-info/${user.id}`, {
  ...form,
}, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});


      const updatedUser = { ...user, must_reset_password: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (user.role === 'adviser') {
        navigate('/adviser/home');
      } else {
        navigate('/teacher/home');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to submit. Please check your input.');
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: '800px' }}>
      <h2 className="text-center text-danger mb-4">Teacher/Adviser Information Form</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleSubmit}>
        <h5 className="text-primary">Personal Information</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label>First Name</label>
            <input type="text" name="first_name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Middle Name</label>
            <input type="text" name="middle_name" className="form-control" onChange={handleChange} />
          </div>
          <div className="col-md-4 mb-3">
            <label>Last Name</label>
            <input type="text" name="last_name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-4 mb-3">
            <label>Gender</label>
            <select name="gender" className="form-control" onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label>Date of Birth</label>
           <input type="date" name="dob" className="form-control" onChange={handleChange} required />

          </div>
          <div className="col-md-4 mb-3">
            <label>Age</label>
            <input type="number" name="age" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Nationality</label>
            <input type="text" name="nationality" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Religion</label>
            <input type="text" name="religion" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-12 mb-3">
            <label>Home Address</label>
            <input type="text" name="address" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Contact Number</label>
            <input type="text" name="contact_number" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Position</label>
            <input type="text" name="position" className="form-control" onChange={handleChange} required />
          </div>
        </div>

        <h5 className="text-primary mt-4">Reset Password</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>New Password</label>
            <input type="password" name="password" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Confirm Password</label>
            <input type="password" name="password_confirmation" className="form-control" onChange={handleChange} required />
          </div>
        </div>

        <div className="d-flex justify-content-between gap-3 mt-3">
          <button type="submit" className="btn btn-danger w-100">Submit</button>
          <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
