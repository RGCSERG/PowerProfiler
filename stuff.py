import requests
import json

# Define the list of washing machine IDs
washing_machine_ids = [
    "1023257",
    "1002635",
    "1004000",
    "1011607",
    "1679602",
    "225706",
    "370139",
]

# Define the base URL for washing machines
base_url = "https://eprel.ec.europa.eu/api/products/washingmachines2019/"

# Initialize a list to store the responses
responses = []

# Specify the fields you want to keep
fields_to_keep = [
    "energyConsPer100Cycle",
    "energyClass",
    "spinSpeedRated",
    "noiseClass",
    "programmeDurationQuarter",
    "powerNetworkStandby",
    "maxTemperatureQuarter",
    "powerStandbyMode",
    "programmeDurationHalf",
    "energyConsPerCycle",
    "powerOffMode",
    "spinSpeedHalf",
    "noise",
    "maxTemperatureRated",
    "ratedCapacity",
    "maxTemperatureHalf",
    "spinSpeedQuarter",
    "spinClass",
    "moistureQuarter",
    "moisture",
    "programmeDurationRated",
    "powerDelayStart",
    "guaranteeDuration",
    "productGroup",
    "waterCons",
    "type",
]

# Send requests for each washing machine ID and store the responses
for washing_machine_id in washing_machine_ids:
    url = f"{base_url}{washing_machine_id}"
    response = requests.get(url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        data = response.json()

        # Extract only the specified fields from the response
        extracted_data = {field: data.get(field) for field in fields_to_keep}

        responses.append(extracted_data)
    else:
        print(
            f"Request for washing machine {washing_machine_id} failed with status code {response.status_code}"
        )

# Store the filtered responses in a JSON file
with open("filtered_washing_machine_responses.json", "w") as json_file:
    json.dump(responses, json_file, indent=4)

print("Data retrieval and storage complete.")
