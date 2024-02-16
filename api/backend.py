from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS  # Import CORS from flask_cors module
import os
import zipfile
import yaml
import shutil
import json
from pymongo import MongoClient
import uuid

app = Flask(__name__)
CORS(app) 

# Initialize MongoClient
client = MongoClient('mongodb+srv://saajidvbasheer:qB2jA5eeYystkoZt@cluster0.dtyyneb.mongodb.net/')

# Select database
db = client['Test']  # Replace 'your_database' with your actual database name

# Select collection
config_collection = db['extension_definition']  # Replace 'config' with your actual collection name
extension_config=db['extension_config']

@app.route('/apps', methods=['GET'])
def get_apps():
    # Retrieve all documents from the qh_apps collection
    apps = list(config_collection.find({}, {'_id': 0}))

    return jsonify({"apps": apps})

@app.route('/upload', methods=['POST'])
def add_app():
    global apps
    uploaded_file = request.files['file']
    
    # Ensure it's a .app file
    if not uploaded_file.filename.endswith('.app'):
        return jsonify({"error": "Invalid file format. Please upload a .app file"}), 400

    # Create a temporary directory to extract the contents
    temp_dir = 'temp'
    os.makedirs(temp_dir, exist_ok=True)
    uploaded_file.save(os.path.join(temp_dir, uploaded_file.filename))

    # Extract manifest.yml from the .app file
    manifest_path = os.path.join(temp_dir, 'manifest.yml')
    with zipfile.ZipFile(os.path.join(temp_dir, uploaded_file.filename), 'r') as zip_ref:
        zip_ref.extract('manifest.yml', temp_dir)

    # Read app name, instance name , and description from manifest.yml
    with open(manifest_path, 'r') as f:
        manifest_data = yaml.safe_load(f)
        app_name = manifest_data.get('name', 'Unknown')
        instance_name = manifest_data.get('inst_name', "App 1")
        desc = manifest_data.get('desc', 'Unknown')
    
    # Path to the config file inside the .app package
    config_path = os.path.join(temp_dir, 'config', 'config.json')
    with zipfile.ZipFile(os.path.join(temp_dir, uploaded_file.filename), 'r') as zip_ref:
        zip_ref.extract('config/config.json', temp_dir)


    if os.path.exists(config_path):
    # Read the contents of the config file
        with open(config_path, 'r') as f:
            config_data = json.load(f)

    # Delete temporary directory
    shutil.rmtree(temp_dir)

    uuid_short = str(uuid.uuid4())[:8]

    #adding to db
    config_collection.insert_one({'id': uuid_short,'app_name': app_name,'instance_name': instance_name,'description': desc,'plugin_config':config_data})

    # Add the app to the list
    #new_app = {"name": app_name, "App Instance name": instance_name, "Description": desc}
    #apps.append(new_app)
    
    #config_data = request.json.get('plugin_config', []) # Get the config array from the request
      # Replace with your actual collection name
    print("Config data:", config_data)
    
    #return jsonify({"message": config_data}), 200
    return jsonify({"message": "App added successfully"}), 201

    

@app.route('/apps/<app_name>/config', methods=['GET'])
def get_config(app_name):
    try:
        # Query the MongoDB collection to retrieve the extension_config based on the provided app_name
        extension_confi = config_collection.find_one({'app_name': app_name})

        if extension_confi:
            # If extension_config is found, extract and return the plugin_config
            plugin_config = extension_confi.get('plugin_config', {})
            return jsonify({'plugin_config': plugin_config}), 200
        else:
            # If extension_config is not found, return a 404 Not Found response
            return jsonify({'error': 'Extension config not found'}), 404

    except Exception as e:
        # Log the error traceback
        print(f"Error fetching extension config for app '{app_name}': {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/apps/<app_name>/saveconfig', methods=['POST'])
def save_config(app_name):
    config_data = request.json # Get the config array from the request
    print("Config data:", config_data)

    extension_confi = config_collection.find_one({'app_name': app_name})
    if extension_confi:
        extension_id = extension_confi.get('id')
    
    # Save the config data to MongoDB
    extension_config.update_one({'id': extension_id}, {'$set': {'plugin_config':config_data}}, upsert=True)
    return jsonify({"message": config_data}), 200

@app.route('/apps/<app_name>/run', methods=['POST'])
def run_app(app_name):
    # Perform actions to run the app
    return jsonify({"message": f"App '{app_name}' is now running."}), 200

if __name__ == '__main__':
    app.run(debug=True)