import React, { useState } from 'react';
import Modal from 'react-modal';
import './JobsPage.css'; // Import your CSS file for styling

// App component
const Jobs = ({openModalProp}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <button onClick={openModal} className="add-job-btn">Add Job</button>
            <JobModal isOpen={modalIsOpen} closeModal={closeModal} />
        </div>
    );
};

// JobModal component
const JobModal = ({ isOpen, closeModal }) => {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [image, setImage] = useState(null);

    const handleJobSubmit = () => {
        const formData = new FormData();
        formData.append('jobTitle', jobTitle);
        formData.append('jobDescription', jobDescription);
        formData.append('companyName', companyName);
        formData.append('image', image);

        fetch('http://localhost:8000/api/v1/job/create-job', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (response.ok) {
                console.log('Job submitted successfully');
                closeModal();
            } else {
                throw new Error('Failed to submit job');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal} className="modal">
            {/* <h2>Add New Job</h2> */}

            <div className="form-group">
                <label className="form-label">Job Title:</label>
                <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Company Name:</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Job Description:</label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Image:</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="form-input"
                />
            </div>
            <button onClick={handleJobSubmit} className="submit-btn">Add Job</button>
            <button onClick={closeModal} className="cancel-btn">Cancel</button>
        </Modal>
    );
};

export default Jobs;