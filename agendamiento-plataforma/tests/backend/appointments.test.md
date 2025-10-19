# Backend Appointments Tests (Plan)

- GET /api/health -> 200 OK
- GET /api/appointments?ownerId=1 -> array
- POST /api/appointments -> 201, creates record
- POST overlapping -> 409
- GET /api/appointments/availability -> array of slots
