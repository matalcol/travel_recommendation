const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');

function searchCondition() {
    const input = document.getElementById('destinationInput').value.toLowerCase().trim(); // User input
    const resultDiv = document.getElementById('result'); // The div where the result will be displayed
    resultDiv.innerHTML = ''; // Clear previous results

    fetch('travel_recommendation_api.json') // Fetch JSON data
        .then(response => response.json())
        .then(data => {
            let recommendations = [];
            
            // Filter based on keyword
            if (input === 'beach') {
                recommendations = data.beaches.slice(0, 2); // Get first 2 beach recommendations
            } else if (input === 'temple') {
                recommendations = data.temples.slice(0, 2); // Get first 2 temple recommendations
            } else if (input === 'country') {
                recommendations = data.countries.flatMap(country => country.cities).slice(0, 2); // Get first 2 cities from all countries
            } else {
                resultDiv.innerHTML = '<p>Please enter a valid keyword: beach, temple, or country.</p>';
                return;
            }

            // Display recommendations
            if (recommendations.length > 0) {
                recommendations.forEach(place => {
                    resultDiv.innerHTML += `
                        <div style="margin-bottom: 20px;">
                            <h2>${place.name}</h2>
                            <img src="${place.imageUrl}" alt="${place.name}" style="max-width: 100%; height: auto; margin-bottom: 10px;">
                            <p>${place.description}</p>
                        </div>
                    `;
                });
            } else {
                resultDiv.innerHTML = '<p>No recommendations found for this category.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p>An error occurred while fetching data.</p>';
        });
}

// Clear function to reset the input and result div
function clearResults() {
    document.getElementById('destinationInput').value = ''; // Clear the input field
    document.getElementById('result').innerHTML = ''; // Clear the result div
}

btnSearch.addEventListener('click', searchCondition);
btnClear.addEventListener('click', clearResults);
