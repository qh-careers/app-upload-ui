import { useState, useEffect } from 'react';
import '../App.css';
import './Form.css';

function Form() {
    const [form, setForm] = useState(false);
    const [formData, setFormData] = useState({
        gender: '',
        key: '',
        name: ''
    });

    useEffect(() => {
        // Fetch the plugin_config from the extension
        // Assuming the extension provides the data asynchronously
        fetchPluginConfig("Instagram")
            .then(pluginConfig => {
                // Create the form data based on the first pluginConfig
                const initialFormData = createFormDataFromPluginConfig(pluginConfig[0]);
                setFormData(initialFormData);
            }).catch(error => console.error('Error fetching plugin config:', error));
    }, []);

    const fetchPluginConfig = async (appName) => {
        try {
            // Make the API call to fetch the plugin config
            // Replace the URL with the actual endpoint
            const response = await fetch(`http://127.0.0.1:5000/apps/${appName}/config`);
            const data = await response.json();
            console.log(data);
            return data.plugin_config; // Assuming plugin_config is the required data
        } catch (error) {
            console.error('Error fetching plugin config:', error);
            return null; // Return null in case of error
        }
    };

    const createFormDataFromPluginConfig = (pluginConfig) => {
        const formData = {
            gender: '',
            key: '',
            name: ''
        };
        if (pluginConfig) {
            formData.gender = pluginConfig.gender || '';
            formData.key = pluginConfig.key || '';
            formData.name = pluginConfig.name || '';
        } else {
            console.error('Plugin config is not in the expected format.');
        }
        return formData;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch('http://127.0.0.1:5000/${appName}/saveconfig', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });
          if (response.ok) {
              // Form data successfully submitted to the database
              console.log('Form data submitted successfully');
              // You may want to reset the form after successful submission
              setFormData({
                  gender: '',
                  key: '',
                  name: ''
              });
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
                <svg onClick={() => { setForm(!form) }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </div>
            {form && <div>
                <form onSubmit={handleSubmit}>
                    <div className='container'>
                        <div className='form-container'>
                            <label>Gender:</label>
                            <input className='input' type="text" name="gender" value={formData.gender} onChange={handleChange} />
                        </div>
                        <div className='form-container'>
                            <label>Key:</label>
                            <input className='input' type="text" name="key" value={formData.key} onChange={handleChange} />
                        </div>
                        <div className='form-container'>
                            <label>Name:</label>
                            <input className='input' type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <button className='btn' type="submit">Submit</button>
                    </div>
                </form>
            </div>}
        </div>
    );
}

export default Form;
