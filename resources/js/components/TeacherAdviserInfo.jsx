// src/pages/AdviserTeacher.jsx
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
      await axios.put(`http://shs-portal.test/api/teacher-info/${user.id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const updatedUser = { ...user, must_reset_password: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate(user.role === 'adviser' ? '/adviser/home' : '/teacher/home');
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
    <div className="container my-5" style={{ maxWidth: '800px' }}>
      <div className="card shadow-sm p-4 rounded-4">
        <h2 className="text-center text-danger mb-4">Teacher/Adviser Information</h2>
        {message && <div className="alert alert-danger">{message}</div>}
        <form onSubmit={handleSubmit}>
          <h5 className="text-primary mb-3">Personal Information</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label>First Name</label>
              <input type="text" name="first_name" className="form-control rounded-3" onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label>Middle Name</label>
              <input type="text" name="middle_name" className="form-control rounded-3" onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label>Last Name</label>
              <input type="text" name="last_name" className="form-control rounded-3" onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label>Gender</label>
              <select name="gender" className="form-select rounded-3" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="col-md-4">
              <label>Date of Birth</label>
              <input type="date" name="dob" className="form-control rounded-3" onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label>Age</label>
              <input type="number" name="age" className="form-control rounded-3" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Nationality</label>
              <input type="text" name="nationality" className="form-control rounded-3" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label>Religion</label>
              <input type="text" name="religion" className="form-control rounded-3" onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label>Home Address</label>
              <input type="text" name="address" className="form-control rounded-3" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label>Contact Number</label>
              <input type="text" name="contact_number" className="form-control rounded-3" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label>Position</label>
              <input type="text" name="position" className="form-control rounded-3" onChange={handleChange} required />
            </div>
          </div>

          <h5 className="text-primary mt-4 mb-3">Set Password</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label>New Password</label>
              <input type="password" name="password" className="form-control rounded-3" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label>Confirm Password</label>
              <input type="password" name="password_confirmation" className="form-control rounded-3" onChange={handleChange} required />
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button type="submit" className="btn btn-danger flex-fill rounded-3">Submit</button>
            <button type="button" className="btn btn-secondary flex-fill rounded-3" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
