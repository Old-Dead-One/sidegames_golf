const fs = require("fs");

// Load the events and locations data
const eventsData = JSON.parse(fs.readFileSync("../data/events.json", "utf8"));
const locationsData = JSON.parse(
  fs.readFileSync("../data/locations.json", "utf8")
);

// Create a mapping of location IDs to labels
const locationMap = {};
locationsData.forEach((location) => {
  locationMap[location.location_id] = location.label;
});

// Update events to include the location label
eventsData.forEach((tour) => {
  tour.events.forEach((location) => {
    location.events.forEach((event) => {
      // Add the location label to each event
      event.location_label =
        locationMap[location.location_id] || "Unknown Location";
    });
  });
});

// Write the updated events data back to events.json
fs.writeFileSync(
  "../data/events.json",
  JSON.stringify(eventsData, null, 2),
  "utf8"
);

console.log("Updated events.json with location labels.");
