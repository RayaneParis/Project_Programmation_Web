const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let events = [
  {
    id: 1,
    title: "Workshop Python",
    date: "2026-01-01",
    location: "Paris",
    category: "workshop",
    participants: [1]
  },
  {
    id: 2,
    title: "Conference Web Development",
    date: "2026-02-15",
    location: "Lyon",
    category: "conference",
    participants: []
  }
];

let participants = [
  {
    id: 1,
    name: "Nima",
    email: "nima@example.com"
  },
  {
    id: 2,
    name: "Ali",
    email: "ali@example.com"
  }
];

const findEventById = (id) => events.find((event) => event.id === id);

const findParticipantById = (id) =>
  participants.find((participant) => participant.id === id);

const getNextEventId = () =>
  events.length > 0 ? Math.max(...events.map((event) => event.id)) + 1 : 1;

const getNextParticipantId = () =>
  participants.length > 0
    ? Math.max(...participants.map((participant) => participant.id)) + 1
    : 1;

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const enrichEvent = (event) => ({
  ...event,
  participants: event.participants
    .map((participantId) => findParticipantById(participantId))
    .filter(Boolean)
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Node.js Express API is running",
    endpoints: {
      events: [
        "GET /events",
        "GET /events/:id",
        "POST /events",
        "PUT /events/:id",
        "DELETE /events/:id",
        "POST /events/:id/register"
      ],
      participants: ["GET /participants", "POST /participants"],
      dashboard: ["GET /dashboard/stats"]
    }
  });
});

app.get("/events", (req, res) => {
  const { category, date } = req.query;

  let filteredEvents = events;

  if (category) {
    filteredEvents = filteredEvents.filter(
      (event) => event.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (date) {
    filteredEvents = filteredEvents.filter((event) => event.date === date);
  }

  res.status(200).json({
    success: true,
    count: filteredEvents.length,
    data: filteredEvents.map(enrichEvent)
  });
});

app.get("/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const event = findEventById(eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }

  return res.status(200).json({
    success: true,
    data: enrichEvent(event)
  });
});

app.post("/events", (req, res) => {
  const { title, date, location, category } = req.body;

  if (!title || !date || !location || !category) {
    return res.status(400).json({
      success: false,
      error: "All fields are required: title, date, location, category"
    });
  }

  const existingEvent = events.find(
    (event) =>
      event.title.toLowerCase() === title.toLowerCase() && event.date === date
  );

  if (existingEvent) {
    return res.status(409).json({
      success: false,
      error: "An event with the same title and date already exists"
    });
  }

  const newEvent = {
    id: getNextEventId(),
    title,
    date,
    location,
    category,
    participants: []
  };

  events.push(newEvent);

  return res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: enrichEvent(newEvent)
  });
});

app.put("/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const event = findEventById(eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }

  const { title, date, location, category } = req.body;

  if (!title || !date || !location || !category) {
    return res.status(400).json({
      success: false,
      error: "All fields are required: title, date, location, category"
    });
  }

  const duplicateEvent = events.find(
    (existingEvent) =>
      existingEvent.id !== eventId &&
      existingEvent.title.toLowerCase() === title.toLowerCase() &&
      existingEvent.date === date
  );

  if (duplicateEvent) {
    return res.status(409).json({
      success: false,
      error: "Another event with the same title and date already exists"
    });
  }

  event.title = title;
  event.date = date;
  event.location = location;
  event.category = category;

  return res.status(200).json({
    success: true,
    message: "Event updated successfully",
    data: enrichEvent(event)
  });
});

app.delete("/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const eventIndex = events.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }

  const deletedEvent = events[eventIndex];
  events.splice(eventIndex, 1);

  return res.status(200).json({
    success: true,
    message: "Event deleted successfully",
    data: enrichEvent(deletedEvent)
  });
});

app.post("/events/:id/register", (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const { participantId } = req.body;

  const event = findEventById(eventId);
  const participant = findParticipantById(participantId);

  if (!event) {
    return res.status(404).json({
      success: false,
      error: "Event not found"
    });
  }

  if (!participant) {
    return res.status(404).json({
      success: false,
      error: "Participant not found"
    });
  }

  if (event.participants.includes(participantId)) {
    return res.status(400).json({
      success: false,
      error: "Participant already registered"
    });
  }

  event.participants.push(participantId);

  return res.status(200).json({
    success: true,
    message: "Participant registered successfully",
    data: enrichEvent(event)
  });
});

app.get("/participants", (req, res) => {
  res.status(200).json({
    success: true,
    count: participants.length,
    data: participants
  });
});

app.post("/participants", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "Both name and email are required"
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format"
    });
  }

  const existingParticipant = participants.find(
    (participant) => participant.email.toLowerCase() === email.toLowerCase()
  );

  if (existingParticipant) {
    return res.status(409).json({
      success: false,
      error: "A participant with this email already exists"
    });
  }

  const newParticipant = {
    id: getNextParticipantId(),
    name,
    email
  };

  participants.push(newParticipant);

  return res.status(201).json({
    success: true,
    message: "Participant created successfully",
    data: newParticipant
  });
});

app.get("/dashboard/stats", (req, res) => {
  const totalEvents = events.length;
  const totalParticipants = participants.length;
  const totalRegistrations = events.reduce(
    (sum, event) => sum + event.participants.length,
    0
  );

  res.status(200).json({
    success: true,
    data: {
      totalEvents,
      totalParticipants,
      totalRegistrations
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
