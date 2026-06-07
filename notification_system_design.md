# Notification System Design

## Stage 1: API Design
The backend uses a small Express API with routes for listing, reading, creating, updating, and deleting notifications. The frontend only calls the backend external notifications endpoint.

## Stage 2: Database Design
MySQL stores students and notifications. Each notification belongs to one student and keeps the title, type, message, read state, and timestamp.

## Stage 3: SQL Index Optimization
The index on `notifications(student_id, is_read, created_at)` helps filter unread notifications by student and keeps recent records fast to fetch.

## Stage 4: Scalability
For more traffic, Redis can cache frequent reads, pagination can limit payload size, and a CDN can serve the frontend assets quickly.

## Stage 5: Message Queue
BullMQ, RabbitMQ, or Kafka can process notification delivery in the background so writes stay fast and slow tasks do not block the API.

## Stage 6: Priority Heap Algorithm
Top priority notifications use a simple sort with weights: Placement = 3, Result = 2, Event = 1. Newer notifications come first when weights are equal.

## Stage 7: React Frontend
The frontend is a small React + Vite app using Material UI cards, filter buttons, and a Top 10 view. It handles different API field names and shows loading and empty states.