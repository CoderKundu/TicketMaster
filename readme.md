# TicketMaster  

TicketMaster is a chatbot-based online ticketing system for museums and shows. It replaces manual booking systems with a modern, automated solution that provides visitors with a seamless experience and administrators with valuable analytics.  

---

## Problem  

Manual ticket booking in museums often leads to:  
- Long queues during peak hours  
- Human errors such as double bookings or wrong tickets  
- Lost records  
- Frustrated visitors and poor experiences  

---

## Solution  

TicketMaster solves these challenges with an AI-powered chatbot interface that automates the entire ticketing process. Visitors can interact with the chatbot to book tickets, confirm availability, and instantly receive QR code tickets for entry. On the admin side, a dashboard provides real-time insights into bookings, revenue, and visitor trends.  

---

## Features  

- **Chatbot Ticket Booking** – Book tickets using a conversational chatbot interface.  
- **Slot Availability Management** – Validates requested slots and suggests alternatives if full.  
- **QR Code Ticket Generation** – Instantly generates scannable QR codes for confirmed bookings.  
- **Payment Gateway (Mock)** – Simulated integration with payment gateway APIs.  
- **Admin Dashboard** – Provides analytics on bookings, revenue, and visitor traffic.  

---

## Tech Stack  

### Frontend  
- Next.js 14 (App Router)  
- React.js  
- Tailwind CSS  
- ShadCN/UI (pre-built UI components)  

### Backend  
- Node.js  
- Express.js  
- Supabase / PostgreSQL (optional for persistent data storage)  
- QRCode library (for generating QR code tickets)  
