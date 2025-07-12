# 🎯 Agent Dashboard Guide

## Overview
The Agent Dashboard provides comprehensive tools for managing travel packages, bookings, reviews, and customer inquiries.

## 🚀 Quick Start

### 1. Access Agent Dashboard
- **Login**: Use your agent credentials (role: "AGENT" or "TRAVEL_AGENT")
- **Navigate**: Click "Agent Dashboard" button in header or go to `/agent`
- **Test**: Visit `/test` and use "Login as Agent" button for testing

### 2. Package Management

#### View Packages
- **Dashboard**: Overview of all packages with statistics
- **Filter**: By status (Active/Inactive/Draft), destination, or search term
- **Refresh**: Click refresh button to load latest data

#### Add New Package
1. Click **"Add Package"** button
2. Fill required fields:
   - **Title**: Package name (e.g., "Explore the Alps")
   - **Destination**: Location (e.g., "Swiss Alps")
   - **Duration**: Trip length (e.g., "7 Days")
   - **Price**: Cost in USD
   - **Description**: Detailed package information
3. Optional fields:
   - **Included Services**: What's covered (e.g., "Flights, Hotel, Meals")
   - **Available Seats**: Number of spots available
4. Click **"Create Package"**

#### Edit Package
1. Find package in the list
2. Click **"Edit"** button
3. Modify any fields
4. Click **"Update Package"**

#### Delete Package
1. Find package in the list
2. Click **"Delete"** button
3. Confirm deletion in popup

### 3. Booking Management

#### View Bookings
- **All Bookings**: Complete list with customer details
- **Filter**: By status (Pending/Confirmed/Cancelled/Completed) or payment status
- **Search**: By booking ID, customer name, or email

#### Update Booking Status
1. Find booking in the list
2. Click **"View Details"** to see full information
3. Use status dropdown to change booking status
4. Changes are saved automatically

### 4. Review Management

#### View Reviews
- **All Reviews**: Customer feedback with ratings
- **Filter**: By rating (1-5 stars) or response status
- **Search**: By review content or customer ID

#### Respond to Reviews
1. Find review without agent response
2. Click **"Respond"** button
3. Write your response
4. Click **"Submit Response"**

### 5. Customer Inquiries

#### Handle Inquiries
- **View**: All customer support requests
- **Respond**: Provide assistance to customers
- **Track**: Monitor inquiry status and resolution

## 📊 Dashboard Features

### Package Statistics
- **Total Packages**: Count of all packages
- **Active Packages**: Currently available packages
- **Average Price**: Mean package cost
- **Destinations**: Number of unique locations

### Quick Actions
- **Add Package**: Create new travel package
- **Manage Reviews**: Respond to customer feedback
- **View Analytics**: Performance metrics
- **Settings**: Dashboard configuration

## 🔧 Technical Details

### API Endpoints Used
- **Packages**: `/packages` (GET, POST, PUT, DELETE)
- **Bookings**: `/bookings` (GET, PUT for status)
- **Reviews**: `/reviews` (GET, POST for responses)

### Data Fields
#### Package Fields
- `packageId`: Unique identifier
- `title`: Package name
- `description`: Detailed description
- `destination`: Travel location
- `duration`: Trip length
- `price`: Cost in USD
- `includedServices`: What's included
- `status`: Active/Inactive/Draft
- `availableSeats`: Number of spots

#### Booking Fields
- `bookingId`: Unique identifier
- `userId`: Customer ID
- `packageId`: Package reference
- `startDate/endDate`: Travel dates
- `status`: Booking status
- `travelers`: Passenger details
- `hasInsurance`: Insurance status
- `totalAmount`: Total cost
- `paymentStatus`: Payment status

## 🎨 UI Features

### Status Badges
- **Green**: Active/Confirmed/Paid
- **Yellow**: Pending/Draft
- **Red**: Inactive/Cancelled/Failed
- **Blue**: Completed

### Responsive Design
- **Desktop**: Full dashboard with sidebar
- **Mobile**: Collapsible menu and cards
- **Tablet**: Optimized layout

## 🚨 Troubleshooting

### Common Issues
1. **Packages not loading**: Check API Gateway status at `/test`
2. **Can't save changes**: Verify all required fields are filled
3. **Permission errors**: Ensure you're logged in as agent role

### Support
- **Test Dashboard**: Visit `/test` for system diagnostics
- **API Status**: Check service connectivity
- **Error Messages**: Clear error descriptions with retry options

## 📱 Mobile Access
The agent dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

All features are available across devices with optimized layouts.

---

**Need Help?** Contact system administrator or check the test dashboard at `/test` for system status. 