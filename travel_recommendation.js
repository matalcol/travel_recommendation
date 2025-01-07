const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');

function searchCondition() {
    const input = document.getElementById('destinationInput').value.toLowerCase().trim(); // User input
    const resultDiv = document.getElementById('result'); // The div where the result will be displayed
    resultDiv.innerHTML = ''; // Clear previous results

    // Check if input is blank
    if (input === '') {
        resultDiv.innerHTML = '<p>Please enter a search term.</p>';
        return; // Stop execution if input is blank
    }

    fetch('travel_recommendation_api.json') // Fetch JSON data
        .then(response => response.json())
        .then(data => {
            let recommendations = [];

            // Check if input is a keyword
            if (input === 'beach') {
                recommendations = data.beaches; // Get only first 2 beach recommendations use .slice(0, 2)
            } else if (input === 'temple') {
                recommendations = data.temples; // Get first 2 temple recommendations use .slice(0, 2)
            } else if (input === 'country') {
                recommendations = data.countries.flatMap(country => country.cities); // Get first 2 cities use .slice(0, 2)
            } else {
                // If not a keyword, search for a specific city
                const cities = data.countries.flatMap(country => country.cities); // Flatten all cities into one array
                recommendations = cities.filter(city => city.name.toLowerCase().includes(input));

                // Check other categories (beaches and temples) for specific matches
                if (recommendations.length === 0) {
                    const temples = data.temples.filter(temple => temple.name.toLowerCase().includes(input));
                    const beaches = data.beaches.filter(beach => beach.name.toLowerCase().includes(input));
                    recommendations = [...temples, ...beaches];
                }
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
                resultDiv.innerHTML = '<p>No results found. Please try a different city or use keyword: beach, temple, or country.</p>';
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
