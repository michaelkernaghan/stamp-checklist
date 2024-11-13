import csv
import json
import os

def csv_to_json(csv_file, json_file):
    data = {}
    current_country = None
    current_section = "stamps"  # Default section for general stamps

    with open(csv_file, 'r') as file:
        reader = csv.reader(file)

        for row in reader:
            # Check if the row starts a new country
            if row[0] and not row[1]:  # New country name
                current_country = row[0].strip()
                data[current_country] = {"stamps": []}  # Initialize country data
                current_section = "stamps"  # Reset to default section
            elif row[0]:  # New section within the current country
                current_section = row[0].strip()
                if current_country and current_section not in data[current_country]:
                    data[current_country][current_section] = []
            elif row[1]:  # Year and catalogue numbers for the current section
                year = row[1].strip()
                numbers = [num for num in row[2:] if num]
                entry = {"year": year, "numbers": numbers}
                if current_country:
                    data[current_country][current_section].append(entry)

    # Write the aggregated data to JSON
    with open(json_file, 'w') as outfile:
        json.dump(data, outfile, indent=4)

def process_all_csv_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith('.csv'):
            csv_path = os.path.join(directory, filename)
            json_filename = filename.replace('.csv', '.json')
            json_path = os.path.join(directory, json_filename)
            
            print(f"Processing {csv_path} -> {json_path}")
            csv_to_json(csv_path, json_path)

# Usage
process_all_csv_files('data')
