import React, { useState } from 'react';
import './Register.css';

const RegistrationForm = () => {
  const [currentCard, setCurrentCard] = useState(1);
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
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    passwordMatch: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

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

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      document: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent || !formData.privacyAgreement) {
      alert('Please accept the consent and privacy agreement.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, passwordMatch: true });
      return;
    } else {
      setErrors({ ...errors, passwordMatch: false });
    }

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
        alert('Form submitted successfully');
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
          confirmPassword: '',
        });
        setCurrentCard(1); // Reset to the first card
      } else {
        alert('Form submission failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const goToNextCard = () => {
    setCurrentCard((prevCard) => Math.min(prevCard + 1, 6));
  };

  const goToPreviousCard = () => {
    setCurrentCard((prevCard) => Math.max(prevCard - 1, 1));
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className={`card ${currentCard === 1 ? 'active' : ''}`}>
          <h2>Personal Details</h2>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />

          <label>Date of Birth:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

          <div className="nav-buttons">
            <button type="button" className="prev" />
            <button type="button" onClick={goToNextCard}>Next</button>
          </div>
        </div>

        <div className={`card ${currentCard === 2 ? 'active' : ''}`}>
          <h2>Residential Details</h2>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />

          <label>Number of Family Members:</label>
          <input type="number" name="familyMembers" value={formData.familyMembers} onChange={handleChange} required />

          <div className="nav-buttons">
            <button type="button" onClick={goToPreviousCard}>Previous</button>
            <button type="button" onClick={goToNextCard}>Next</button>
          </div>
        </div>

        <div className={`card ${currentCard === 3 ? 'active' : ''}`}>
          <h2>Document Details</h2>
          <label>Ration Card Number:</label>
          <input type="text" name="rationCardNumber" value={formData.rationCardNumber} onChange={handleChange} required />

          <label>Aadhaar Number:</label>
          <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required />

          <div className="nav-buttons">
            <button type="button" onClick={goToPreviousCard}>Previous</button>
            <button type="button" onClick={goToNextCard}>Next</button>
          </div>
        </div>

        <div className={`card ${currentCard === 4 ? 'active' : ''}`}>
          <h2>Income Details</h2>
          <label>Phone Number:</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

          <label>Income:</label>
          <select name="income" value={formData.income} onChange={handleChange} required>
            <option value="">Select Income</option>
            <option value="below 15000">Below 15,000</option>
            <option value="between 15000 to 1lakh">Between 15,000 to 1 Lakh</option>
            <option value="above 1 lakh">Above 1 Lakh</option>
          </select>

          {formData.incomeColor && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: formData.incomeColor }}>
              Selected income range color: {formData.incomeColor}
            </div>
          )}

          <div className="nav-buttons">
            <button type="button" onClick={goToPreviousCard}>Previous</button>
            <button type="button" onClick={goToNextCard}>Next</button>
          </div>
        </div>

        <div className={`card ${currentCard === 5 ? 'active' : ''}`}>
          <h2>Password Generation</h2>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          {errors.passwordMatch && (
            <div className="error">Passwords do not match!</div>
          )}

          <div className="nav-buttons">
            <button type="button" onClick={goToPreviousCard}>Previous</button>
            <button type="button" onClick={goToNextCard}>Next</button>
          </div>
        </div>

        <div className={`card ${currentCard === 6 ? 'active' : ''}`}>
          <h2>Upload Documents</h2>
          <label>Upload Ration Card or Aadhaar Card:</label>
          <input type="file" name="document" onChange={handleFileChange} required />

          <label>
            <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} />
            I confirm that the information provided above is accurate and valid to the best of my knowledge.
          </label>

          <label>
            <input type="checkbox" name="privacyAgreement" checked={formData.privacyAgreement} onChange={handleChange} />
            I agree to the terms and conditions and consent to the processing of my personal data according to the website’s privacy policy.
          </label>

          <div className="nav-buttons">
            <button type="button" onClick={goToPreviousCard}>Previous</button>
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
