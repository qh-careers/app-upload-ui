import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';
import './Form.css';

function Form() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const {appName} = location.state;
    console.log(appName);

    useEffect(() => {
        // Fetch the plugin_config from the backend
        fetchPluginConfig(`${appName}`)
            .then(pluginConfig => {
                if (pluginConfig) {
                    setFormData(pluginConfig);
                } else {
                    setError('Plugin config is not available or in the expected format.');
                }
            })
            .catch(error => {
                setError('Failed to fetch plugin config. Please try again later.');
                console.error('Error fetching plugin config:', error);
            });
    }, [appName]);

    const fetchPluginConfig = async (appName) => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5000/apps/${appName}/config`);
            const data = await response.json();
            return data.plugin_config || null;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit form data to backend
        try {
            const response = await fetch(`http://127.0.0.1:5000/apps/${appName}/saveconfig`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log('Form data submitted successfully');
                setFormData({});
                setShowForm(false); // Close the form after successful submission
                // Redirect to the main page
                window.location.href = '/'; // This will reload the main page
            } else {
                console.error('Failed to submit form data:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };
    

    return (
        <div className='main-container'>
            <div style={{ textAlign: 'right', cursor: 'pointer' }}>
                <svg onClick={()=>{setShowForm(true)}} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </div>
            {showForm && (
                <div className="popup-container">
                    <div className="popup">
                        <form onSubmit={handleSubmit}>
                            <div className="container">
                                {Object.keys(formData).map((key, index) => (
                                    <div className="form-container" key={index}>
                                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                        <input className="input" type="text" name={key} value={formData[key]} onChange={handleChange} />
                                    </div>
                                ))}
                                <div className="button-container">
                                    <button className="btn cancel" type="button" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button className="btn" type="submit">Save</button>
                                </div>
                                {loading && <p>Loading...</p>}
                                {error && <p>{error}</p>}
                            </div>
                        </form>
                        <span className="close" onClick={() => setShowForm(false)}>&times;</span> {/* Close button */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Form;
 