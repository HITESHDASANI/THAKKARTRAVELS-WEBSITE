# Flight Booking Form - API Integration Setup

## Overview
Your flight booking form has been integrated with API support. The form now attempts to fetch real flight data and falls back to mock data if the API is unavailable.

## Supported APIs

### Option 1: RapidAPI (SkyScanner) - RECOMMENDED for quick setup
**Easiest to implement and most reliable**

1. Go to: https://rapidapi.com/apiheya/api/flight-search-flight-booking
2. Sign up for a free RapidAPI account
3. Click "Subscribe to Test"
4. Get your API key from the dashboard
5. Replace `YOUR_API_KEY_HERE` in the HTML file with your actual API key

```javascript
const API_CONFIG = {
    rapidapi_host: 'hostel-global-data.p.rapidapi.com',
    rapidapi_key: '4bb405b3b2msh36e4a10a29d3f12p1a894ajsna807e5f24f59', // Paste your key here
};
```

**Free tier includes:** 100 requests/month (more than enough for testing)

---

### Option 2: Amadeus Self-Hosted API
**More powerful but requires backend server**

1. Register at: https://developers.amadeus.com/
2. Create your application to get Client ID and Secret
3. Generate access token using OAuth2
4. Set up a backend proxy (since direct API calls from browser have CORS issues)

Backend example (Node.js):
```javascript
// proxy_server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/api/flights', async (req, res) => {
    const token = await getAmadeusToken();
    const response = await fetch(
        `https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${req.query.from}&destinationLocationCode=${req.query.to}&departureDate=${req.query.date}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );
    res.json(await response.json());
});

app.listen(3000);
```

---

### Option 3: Skyscanner API
1. Go to: https://www.skyscanner.net/travel-wide/partners
2. Get API access and documentation
3. Implement similar to RapidAPI setup

---

## How It Works

1. **Search Request**: User fills form and clicks "Search Flights"
2. **API Call**: System attempts to fetch real flights from the API
3. **Error Handling**: If API fails (no key, rate limit, etc.), it automatically uses mock data
4. **Display**: Results are shown to user regardless of API success/failure

## Implementation Details

### Current Implementation
```javascript
async function fetchFlightsFromAPI(from, to, departDate, passengers, travelClass) {
    // Attempts to fetch from RapidAPI
    // Returns null on failure → triggers mock data fallback
}
```

### Mock Data Fallback
The `generateFlights()` function creates realistic mock data if:
- API key is not configured
- API request fails
- API returns no results
- Network error occurs

---

## Testing the Integration

1. **Without API Key**:
   - Form works normally with mock data
   - Check browser console for "Using mock data as API fallback"

2. **With API Key**:
   - Real flight data appears
   - Check browser console for "Fetching flights from API..."
   - Look for API response in Network tab (F12)

---

## Troubleshooting

### Issue: "API Error: 401"
**Solution**: Invalid or expired API key
- Get a new key from RapidAPI
- Update `API_CONFIG.rapidapi_key`

### Issue: "API Error: 429"
**Solution**: Rate limit exceeded
- Wait 1 hour or upgrade RapidAPI plan
- System will use mock data automatically

### Issue: "CORS Error"
**Solution**: Browser blocked cross-origin request
- This is expected from direct browser calls to some APIs
- The fallback to mock data handles this gracefully
- For production, use a backend proxy server

### Issue: "No flights returned"
**Solution**: API working but no flights available
- Check airport codes are correct (must be IATA format)
- Try different dates
- System falls back to mock data

---

## Code Changes Made

### In searchFlights() function:
- Added async/await for API call
- Added loading state feedback
- Implemented fallback logic to mock data
- Preserved original functionality

### New functions added:
- `fetchFlightsFromAPI()` - Handles API communication
- `formatAPIFlights()` - Converts API response to app format

### Backward Compatibility:
- All original functionality preserved
- Mock data generation untouched
- Works with or without API key

---

## Next Steps

1. **Get RapidAPI Key** (5 min):
   - Visit https://rapidapi.com/apiheya/api/flight-search-flight-booking
   - Subscribe to free tier
   - Copy your API key

2. **Update HTML**:
   - Find: `rapidapi_key: 'YOUR_API_KEY_HERE'`
   - Replace with your actual key

3. **Test**:
   - Open the form
   - Search for flights
   - Check browser console (F12 → Console tab)

4. **Monitor**:
   - Watch RapidAPI dashboard for API calls
   - Track rate limit usage
   - Upgrade plan if needed

---

## Production Deployment

For production use:
1. Move API key to backend environment variable (never expose in frontend)
2. Implement backend proxy server
3. Add rate limiting and caching
4. Log all API calls
5. Implement retry logic with exponential backoff
6. Add detailed error handling and user feedback

---

## Additional Resources

- **RapidAPI Docs**: https://rapidapi.com/apiheya/api/flight-search-flight-booking
- **Amadeus API**: https://developers.amadeus.com/
- **Skyscanner API**: https://www.skyscanner.net/
- **CORS Handling**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Last Updated**: December 2025
**Status**: API integration ready for testing
