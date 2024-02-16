import React, { useState, useEffect } from 'react';
import '../App.css';
import './Form.css';

function Form() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch the plugin_config from the backend
        fetchPluginConfig("Instagram")
            .then(pluginConfig => {
                if (pluginConfig) {
                    setFormData(pluginConfig);
                } else {
                    console.error('Plugin config is not available or in the expected format.');
                }
            })
            .catch(error => {
                console.error('Error fetching plugin config:', error);
            });
    }, []);

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
            const response = await fetch('http://127.0.0.1:5000/apps/Instagram/saveconfig', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log('Form data submitted successfully');
                setFormData({});
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
                                <button className="btn cancel" type="button" onClick={() => setFormData(false)}>Cancel</button>
                                <button className="btn" type="submit">Save</button>
                            </div>
                            {loading && <p>Loading...</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Form;
