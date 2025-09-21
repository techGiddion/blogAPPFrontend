import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from '../api/axiosAPI'


const CreateAccount = ({setError,setIsLoggedIn,error}) => {
  const history = useHistory();
  const [form, setForm] = useState({
    useremail: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [success,setSuccess] = useState('')
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setIsLoggedIn("");
  };

  const validate = () => {
    if (!form.useremail || !form.firstname || !form.lastname || !form.username || !form.password || !form.confirmPassword) {
      return "All fields are required.";
    }
    // simple email check
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.useremail)) return "Please enter a valid email.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    // build payload
    const payload = {
      useremail: form.useremail.trim(),
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      username: form.username.trim(),
      password: form.password // hash on server ideally
    };

   try {
    // Make request
    const response = await api.post("/users", payload)
      console.log("Response is good")
      setForm({
        useremail: "",
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        confirmPassword: ""
      });
  setSuccess("Account created successfully! Redirecting...");
  setTimeout(() => history.push("/"), 2000); // needs useNavigate from react-router

  } catch (err) {
    if (err.response?.status === 400) {
      setError("Required fields are missing.");
    } else if (err.response?.status === 409) {
      setError("Username or email already exists.");
    } else if (err.response?.status === 500) {
      setError("Server error. Please try again later.");
    } else {
      setError(err.response?.data?.message || "An unknown error occurred.");
    }
  }
}; 


  return (
    <div className="create-account-container">
      {success && <div className="form-success" role="status">{success}</div>}
      {!success &&
      <form className="create-account-form" onSubmit={handleSubmit} noValidate>
        <h2>Create Account</h2>

        {error && <div className="form-error" role="alert">{error}</div>}
        

         <label htmlFor="useremail">Email</label>
        <input
          id="useremail"
          name="useremail"
          type="email"
          value={form.useremail}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <div className="name-row">
          <div>
            <label htmlFor="firstname">First name</label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              value={form.firstname}
              onChange={handleChange}
              placeholder="First name"
              required
            />
          </div>

          <div>
            <label htmlFor="lastname">Last name</label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="username"
          required
        />

        <div className="password-row">
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <button className="submit-btn" type="submit">Create Account</button>
      </form>}
    </div>
  );
};

export default CreateAccount;
