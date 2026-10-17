# Soil Nutrition System — Front-End Web Application

A responsive, interactive educational web application built with **HTML, CSS, and vanilla JavaScript**.

## Run it
1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. Use the Dashboard sliders to simulate soil moisture, temperature, and pH readings.
4. Press **Simulate new sample** to generate a new illustrative sample or **Reset** to return to the initial values.

No build tools or server are required for this demo.

## Pages / sections included
- Home / hero overview
- About, problem statement, solution, and objectives
- Features overview
- Working process: sensing → processing → transmission → visualization
- Example data payload
- Interactive dashboard with simulated readings, status text, trend chart, and rule-based demo insights
- Project summary and implementation notes

## Important limitations
This is a front-end simulation only. It does **not** connect to a physical ESP32, soil sensors, backend API, cloud service, or database. Dashboard values are generated or changed locally in the browser. The health index and guidance are illustrative and must not be treated as agronomic advice.

For a real implementation, add:
- Calibrated sensors and microcontroller firmware
- A backend API / IoT platform to receive device readings
- Data validation, authentication, timestamps, and persistent storage
- A frontend fetch/WebSocket connection to retrieve live values
- Validated agronomic thresholds based on crop and soil context

N, P, and K values are intentionally not shown as measured data because they require suitable sensors or lab results.
