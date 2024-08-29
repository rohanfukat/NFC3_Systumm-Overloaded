import React, { useState } from 'react';
import './Register.css';

const RegistrationForm = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    address: '',
    familyMembers: '',
    rationCardNumber: '',
    aadhaarNumber: '',
    document: null,
    phoneNumber: '',
    income: '',
    consent: false,
    privacyAgreement: false,
    incomeColor: '',
    password: '',
    confirmPassword: '', // Added for password confirmation
  });

  // State to manage form validation errors
  const [errors, setErrors] = useState({
    passwordMatch: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Update color based on income selection
    if (name === 'income') {
      let selectedColor = '';
      switch (value) {
        case 'below 15000':
          selectedColor = 'yellow';
          break;
        case 'between 15000 to 1lakh':
          selectedColor = 'saffron';
          break;
        case 'above 1 lakh':
          selectedColor = 'white';
          break;
        default:
          selectedColor = '';
      }
      setFormData((prevState) => ({
        ...prevState,
        incomeColor: selectedColor,
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      document: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data (Optional: Add more validation as needed)
    if (!formData.consent || !formData.privacyAgreement) {
      alert('Please accept the consent and privacy agreement.');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, passwordMatch: true });
      return;
    } else {
      setErrors({ ...errors, passwordMatch: false });
    }

    // Create form data to send to backend
    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        body: dataToSend,
      });

      if (response.ok) {
        alert('Form submitted successfully'); // Show alert box on success
        // Clear form after submission
        setFormData({
          fullName: '',
          dob: '',
          address: '',
          familyMembers: '',
          rationCardNumber: '',
          aadhaarNumber: '',
          document: null,
          phoneNumber: '',
          income: '',
          consent: false,
          privacyAgreement: false,
          incomeColor: '',
          password: '',
          confirmPassword: '', // Reset passwords
        });
      } else {
        alert('Form submission failed'); // Show alert box on failure
      }
    } catch (error) {
      alert('Error: ' + error.message); // Show alert box on error
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Full Name:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
      </div>

      <div>
        <label>Date of Birth:</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
      </div>

      <div>
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      <div>
        <label>Number of Family Members:</label>
        <input type="number" name="familyMembers" value={formData.familyMembers} onChange={handleChange} required />
      </div>

      <div>
        <label>Ration Card Number:</label>
        <input type="text" name="rationCardNumber" value={formData.rationCardNumber} onChange={handleChange} required />
      </div>

      <div>
        <label>Aadhaar Number:</label>
        <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required />
      </div>

      <div>
        <label>Upload Ration Card or Aadhaar Card:</label>
        <input type="file" name="document" onChange={handleFileChange} required />
      </div>

      <div>
        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
      </div>

      <div>
        <label>Income:</label>
        <select name="income" value={formData.income} onChange={handleChange} required>
          <option value="">Select Income</option>
          <option value="below 15000">Below 15,000</option>
          <option value="between 15000 to 1lakh">Between 15,000 to 1 Lakh</option>
          <option value="above 1 lakh">Above 1 Lakh</option>
        </select>
      </div>

      {/* Display color based on income selection */}
      {formData.incomeColor && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: formData.incomeColor }}>
          Selected income range color: {formData.incomeColor}
        </div>
      )}

      <div>
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>

      <div>
        <label>Confirm Password:</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
      </div>

      {errors.passwordMatch && (
        <div style={{ color: 'red' }}>Passwords do not match!</div>
      )}

      <div>
        <label>
          <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} />
          I confirm that the information provided above is accurate and valid to the best of my knowledge.
        </label>
      </div>

      <div>
        <label>
          <input type="checkbox" name="privacyAgreement" checked={formData.privacyAgreement} onChange={handleChange} />
          I agree to the terms and conditions and consent to the processing of my personal data according to the website’s privacy policy.
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default RegistrationForm;
