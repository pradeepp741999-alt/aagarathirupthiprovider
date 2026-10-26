# Aagara Thirupthi Provider — Screen-by-Screen API Documentation

## Executive Summary

- **Total Screens in Provider App:** **32 Active Screens** (plus 1 shared layout wrapper: `RegistrationLayout.tsx`)
- **Total Unique API Endpoints:** **79 API Endpoints**
- **Average APIs per Screen:** ~2.5 APIs per screen (ranging from 0 on static screens to 9 on comprehensive management screens)

---

## 1. Quick Master Summary Table

| # | Screen Name | File Path | Category / Module | API Count | Primary API Endpoints |
|---|---|---|---|:---:|---|
| 1 | **OnboardingScreen** | `src/screens/auth/OnboardingScreen.tsx` | Auth / Walkthrough | **0** | *(Static UI / local navigation)* |
| 2 | **LoginScreen** | `src/screens/auth/LoginScreen.tsx` | Auth | **1** | `POST /api/v1/auth/send-otp` |
| 3 | **OtpScreen** | `src/screens/auth/OtpScreen.tsx` | Auth | **2** | `POST /api/v1/auth/verify-otp`, `POST /api/v1/auth/resend-otp` |
| 4 | **RegBusinessInfoScreen** | `src/screens/registration/RegBusinessInfoScreen.tsx` | Registration (Step 1) | **2** | `GET /api/v1/providers/registration/draft`, `PUT /api/v1/providers/registration/step/1` |
| 5 | **RegCategoryScreen** | `src/screens/registration/RegCategoryScreen.tsx` | Registration (Step 2) | **2** | `GET /api/v1/categories`, `PUT /api/v1/providers/registration/step/2` |
| 6 | **RegServiceDetailsScreen** | `src/screens/registration/RegServiceDetailsScreen.tsx` | Registration (Step 3) | **1** | `PUT /api/v1/providers/registration/step/3` |
| 7 | **RegPricingScreen** | `src/screens/registration/RegPricingScreen.tsx` | Registration (Step 4) | **1** | `PUT /api/v1/providers/registration/step/4` |
| 8 | **RegCoverageAreaScreen** | `src/screens/registration/RegCoverageAreaScreen.tsx` | Registration (Step 5) | **2** | `GET /api/v1/districts`, `PUT /api/v1/providers/registration/step/5` |
| 9 | **RegDocumentsScreen** | `src/screens/registration/RegDocumentsScreen.tsx` | Registration (Step 6) | **2** | `POST /api/v1/media/upload-url`, `PUT /api/v1/providers/registration/step/6` |
| 10 | **RegReviewScreen** | `src/screens/registration/RegReviewScreen.tsx` | Registration (Step 7) | **2** | `GET /api/v1/providers/registration/summary`, `POST /api/v1/providers/registration/submit` |
| 11 | **PendingApprovalScreen** | `src/screens/auth/PendingApprovalScreen.tsx` | Auth / Verification | **2** | `GET /api/v1/providers/me/status`, `POST /api/v1/support/enquiry` |
| 12 | **HomeScreen** | `src/screens/home/HomeScreen.tsx` | Main Dashboard | **6** | `GET /api/v1/providers/me`, `GET /api/v1/dashboard/metrics`, `GET /api/v1/enquiries`, `GET /api/v1/bookings`, `GET /api/v1/providers/combos`, `PATCH /api/v1/providers/me/online-status` |
| 13 | **EnquiriesListScreen** | `src/screens/enquiries/EnquiriesListScreen.tsx` | Enquiries Tab | **2** | `GET /api/v1/enquiries`, `GET /api/v1/enquiries/counts` |
| 14 | **EnquiryDetailScreen** | `src/screens/enquiries/EnquiryDetailScreen.tsx` | Enquiries Detail | **4** | `GET /api/v1/enquiries/:id`, `PATCH /api/v1/enquiries/:id/status`, `POST /api/v1/enquiries/:id/quote`, `POST /api/v1/enquiries/:id/messages` |
| 15 | **BookingsListScreen** | `src/screens/bookings/BookingsListScreen.tsx` | Bookings Tab | **2** | `GET /api/v1/bookings`, `GET /api/v1/bookings/counts` |
| 16 | **BookingDetailScreen** | `src/screens/bookings/BookingDetailScreen.tsx` | Bookings Detail | **4** | `GET /api/v1/bookings/:id`, `PATCH /api/v1/bookings/:id/status`, `POST /api/v1/bookings/:id/payments`, `GET /api/v1/bookings/:id/invoice` |
| 17 | **CustomersScreen** | `src/screens/crm/CustomersScreen.tsx` | CRM Tab | **2** | `GET /api/v1/crm/customers`, `GET /api/v1/crm/stats` |
| 18 | **CustomerDetailScreen** | `src/screens/crm/CustomerDetailScreen.tsx` | CRM Detail | **4** | `GET /api/v1/crm/customers/:id`, `GET /api/v1/crm/customers/:id/history`, `GET /api/v1/crm/customers/:id/notes`, `POST /api/v1/crm/customers/:id/notes` |
| 19 | **ServicesManagementScreen** | `src/screens/services/ServicesManagementScreen.tsx` | Catalog Management | **9** | Dishes/Packages/Combos `GET`, `PATCH :id/status`, `DELETE :id` (3 x 3 = 9) |
| 20 | **DishEditorScreen** | `src/screens/services/DishEditorScreen.tsx` | Catalog Editor | **4** | `GET /api/v1/providers/dishes/:id`, `POST /api/v1/media/upload-url`, `POST /api/v1/providers/dishes`, `PUT /api/v1/providers/dishes/:id` |
| 21 | **PackageEditorScreen** | `src/screens/services/PackageEditorScreen.tsx` | Catalog Editor | **4** | `GET /api/v1/providers/packages/:id`, `GET /api/v1/providers/dishes`, `POST /api/v1/providers/packages`, `PUT /api/v1/providers/packages/:id` |
| 22 | **ComboEditorScreen** | `src/screens/services/ComboEditorScreen.tsx` | Catalog Editor | **4** | `GET /api/v1/providers/combos/:id`, `POST /api/v1/media/upload-url`, `POST /api/v1/providers/combos`, `PUT /api/v1/providers/combos/:id` |
| 23 | **AvailabilityCalendarScreen** | `src/screens/services/AvailabilityCalendarScreen.tsx` | Calendar | **3** | `GET /api/v1/providers/availability/month`, `PUT /api/v1/providers/availability/date`, `POST /api/v1/providers/availability/bulk` |
| 24 | **ReviewsScreen** | `src/screens/reviews/ReviewsScreen.tsx` | Reputation | **3** | `GET /api/v1/providers/reviews`, `GET /api/v1/providers/reviews/summary`, `POST /api/v1/providers/reviews/:id/reply` |
| 25 | **ReportsScreen** | `src/screens/reports/ReportsScreen.tsx` | Analytics | **3** | `GET /api/v1/analytics/overview`, `GET /api/v1/analytics/revenue-chart`, `GET /api/v1/analytics/export` |
| 26 | **NotificationsScreen** | `src/screens/home/NotificationsScreen.tsx` | Alerts | **4** | `GET /api/v1/notifications`, `PATCH /api/v1/notifications/:id/read`, `PATCH /api/v1/notifications/mark-all-read`, `DELETE /api/v1/notifications/:id` |
| 27 | **MoreScreen** | `src/screens/profile/MoreScreen.tsx` | Account Tab | **2** | `GET /api/v1/providers/me`, `POST /api/v1/auth/logout` |
| 28 | **EditProfileScreen** | `src/screens/profile/EditProfileScreen.tsx` | Profile | **3** | `GET /api/v1/providers/me`, `POST /api/v1/media/upload-url`, `PUT /api/v1/providers/me` |
| 29 | **BusinessSettingsScreen** | `src/screens/profile/BusinessSettingsScreen.tsx` | Settings | **2** | `GET /api/v1/providers/settings`, `PUT /api/v1/providers/settings` |
| 30 | **EarningsScreen** | `src/screens/profile/EarningsScreen.tsx` | Finance | **2** | `GET /api/v1/providers/earnings/summary`, `GET /api/v1/providers/earnings/transactions` |
| 31 | **DocumentsScreen** | `src/screens/profile/DocumentsScreen.tsx` | Compliance | **3** | `GET /api/v1/providers/documents`, `POST /api/v1/media/upload-url`, `PUT /api/v1/providers/documents/:type` |
| 32 | **HelpSupportScreen** | `src/screens/profile/HelpSupportScreen.tsx` | Support | **2** | `GET /api/v1/support/faqs`, `POST /api/v1/support/tickets` |
| **TOTAL** | **32 Screens** | | | **79 APIs** | *(79 unique endpoints across all flows)* |

---

## 2. Detailed Screen-by-Screen API Specifications

---

### SCREEN 1: OnboardingScreen
- **File:** `src/screens/auth/OnboardingScreen.tsx`
- **Route:** `Onboarding`
- **APIs on this screen:** **0**
- **Description:** Client-side onboarding carousel showing value propositions, customer reach, and a "Get Started" button navigating directly to `LoginScreen`.

---

### SCREEN 2: LoginScreen
- **File:** `src/screens/auth/LoginScreen.tsx`
- **Route:** `Login`
- **APIs on this screen:** **1**

#### API 2.1: Send OTP
- **Method & Route:** `POST /api/v1/auth/send-otp`
- **Purpose:** Sends a 6-digit verification code via SMS/WhatsApp to the provider's 10-digit mobile number.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "mobile": "9876543210"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully to +91 9876543210",
  "data": {
    "mobile": "9876543210",
    "expires_in_seconds": 300,
    "resend_available_in_seconds": 30
  }
}
```

---

### SCREEN 3: OtpScreen
- **File:** `src/screens/auth/OtpScreen.tsx`
- **Route:** `Otp`
- **APIs on this screen:** **2**

#### API 3.1: Verify OTP & Authenticate
- **Method & Route:** `POST /api/v1/auth/verify-otp`
- **Purpose:** Verifies the 6-digit OTP and authenticates the provider. Returns access/refresh JWT tokens and profile onboarding status.
- **Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "provider": {
      "id": "e4a7b3c2-1234-5678-90ab-cdef12345678",
      "mobile": "9876543210",
      "status": "approved", // 'draft' | 'pending' | 'approved' | 'rejected'
      "registration_step": 7,
      "business_name": "Aagara Thirupthi Caterers"
    }
  }
}
```

#### API 3.2: Resend OTP
- **Method & Route:** `POST /api/v1/auth/resend-otp`
- **Purpose:** Triggers a fresh OTP when the countdown timer hits 0.
- **Request Body:**
```json
{
  "mobile": "9876543210"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "New OTP dispatched successfully",
  "data": { "resend_available_in_seconds": 30 }
}
```

---

### SCREEN 4: RegBusinessInfoScreen (Registration Step 1)
- **File:** `src/screens/registration/RegBusinessInfoScreen.tsx`
- **Route:** `RegBusinessInfo`
- **APIs on this screen:** **2**

#### API 4.1: Load Existing Draft
- **Method & Route:** `GET /api/v1/providers/registration/draft`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "registration_step": 1,
    "business_name": "Grand Royal Caterers",
    "owner_name": "Murugan R",
    "whatsapp": "9876543210",
    "email": "murugan@example.com",
    "district": "Salem",
    "description": "20 years of authentic South Indian catering service"
  }
}
```

#### API 4.2: Save Step 1 Business Info
- **Method & Route:** `PUT /api/v1/providers/registration/step/1`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "business_name": "Grand Royal Caterers",
  "owner_name": "Murugan R",
  "whatsapp": "9876543210",
  "email": "murugan@example.com",
  "district": "Salem",
  "description": "Authentic wedding catering specialist with 20+ years tradition"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "registration_step": 2,
    "saved": true
  }
}
```

---

### SCREEN 5: RegCategoryScreen (Registration Step 2)
- **File:** `src/screens/registration/RegCategoryScreen.tsx`
- **Route:** `RegCategory`
- **APIs on this screen:** **2**

#### API 5.1: Get Available Categories
- **Method & Route:** `GET /api/v1/categories`
- **Purpose:** Fetches the list of all supported business categories.
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "id": "catering", "title": "Catering", "icon": "utensils" },
    { "id": "decoration", "title": "Decoration", "icon": "sparkles" },
    { "id": "audio", "title": "Audio & Sound", "icon": "volume-2" },
    { "id": "makeup", "title": "Makeup", "icon": "smile" }
  ]
}
```

#### API 5.2: Save Primary & Secondary Categories
- **Method & Route:** `PUT /api/v1/providers/registration/step/2`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "primary_category": "catering",
  "secondary_categories": ["decoration", "makeup"]
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "registration_step": 3,
    "primary_category": "catering",
    "secondary_categories": ["decoration", "makeup"]
  }
}
```

---

### SCREEN 6: RegServiceDetailsScreen (Registration Step 3)
- **File:** `src/screens/registration/RegServiceDetailsScreen.tsx`
- **Route:** `RegServiceDetails`
- **APIs on this screen:** **1**

#### API 6.1: Save Service Details
- **Method & Route:** `PUT /api/v1/providers/registration/step/3`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body (Dynamic depending on Primary Category):**
  - **For Catering:**
    ```json
    {
      "category": "catering",
      "veg_preference": "both", // 'veg' | 'non-veg' | 'both'
      "min_capacity": 50,
      "max_capacity": 5000,
      "years_active": 12,
      "cuisine_types": ["South Indian", "North Indian", "Chettinad"]
    }
    ```
  - **For Makeup:**
    ```json
    {
      "category": "makeup",
      "makeup_specialties": ["Bridal HD", "Airbrush", "Party Makeup"],
      "bridal_trial_offered": true,
      "service_location": "venue_and_home",
      "max_daily_clients": 3,
      "years_active": 6
    }
    ```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": { "registration_step": 4, "saved": true }
}
```

---

### SCREEN 7: RegPricingScreen (Registration Step 4)
- **File:** `src/screens/registration/RegPricingScreen.tsx`
- **Route:** `RegPricing`
- **APIs on this screen:** **1**

#### API 7.1: Save Pricing Model & Policies
- **Method & Route:** `PUT /api/v1/providers/registration/step/4`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "pricing_model": "per_plate", // 'per_plate' | 'per_event' | 'fixed' | 'hourly'
  "starting_price": 250,
  "advance_percentage": 30,
  "cancellation_policy": "Full refund if cancelled 15 days prior to event",
  "payment_terms": "30% advance, 50% on event date, 20% post service"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": { "registration_step": 5, "saved": true }
}
```

---

### SCREEN 8: RegCoverageAreaScreen (Registration Step 5)
- **File:** `src/screens/registration/RegCoverageAreaScreen.tsx`
- **Route:** `RegCoverageArea`
- **APIs on this screen:** **2**

#### API 8.1: Get Districts & Taluks Directory
- **Method & Route:** `GET /api/v1/districts`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "district": "Salem",
      "areas": ["Salem North", "Salem South", "Attur", "Mettur", "Omalur", "Sankagiri", "Edappadi"]
    },
    {
      "district": "Erode",
      "areas": ["Erode City", "Perundurai", "Bhavani", "Gobichettipalayam", "Sathyamangalam"]
    }
  ]
}
```

#### API 8.2: Save Coverage Districts & Service Areas
- **Method & Route:** `PUT /api/v1/providers/registration/step/5`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "districts": ["Salem", "Erode", "Namakkal"], // Or all 38 districts when "All" is selected
  "service_areas": ["Salem North", "Attur", "Erode City", "Tiruchengode"],
  "travels_outstation": true,
  "outstation_fee_per_km": 15
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": { "registration_step": 6, "saved": true }
}
```

---

### SCREEN 9: RegDocumentsScreen (Registration Step 6)
- **File:** `src/screens/registration/RegDocumentsScreen.tsx`
- **Route:** `RegDocuments`
- **APIs on this screen:** **2**

#### API 9.1: Generate Pre-Signed Document Upload URL
- **Method & Route:** `POST /api/v1/media/upload-url`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "file_name": "fssai_cert.pdf",
  "mime_type": "application/pdf",
  "category": "provider_documents"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "upload_url": "https://storage.googleapis.com/aagara-docs/fssai_cert_123.pdf?X-Goog-Algorithm=...",
    "file_url": "https://cdn.aagarathirupthi.com/docs/fssai_cert_123.pdf",
    "expires_in_seconds": 900
  }
}
```

#### API 9.2: Save Uploaded Document Metadata
- **Method & Route:** `PUT /api/v1/providers/registration/step/6`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "documents": [
    {
      "type": "aadhaar",
      "number": "987654321098",
      "file_url": "https://cdn.aagarathirupthi.com/docs/aadhaar_123.pdf"
    },
    {
      "type": "pan",
      "number": "ABCDE1234F",
      "file_url": "https://cdn.aagarathirupthi.com/docs/pan_123.pdf"
    },
    {
      "type": "gst",
      "number": "33ABCDE1234F1Z5",
      "file_url": "https://cdn.aagarathirupthi.com/docs/gst_123.pdf"
    },
    {
      "type": "trade_license",
      "number": "TL/2026/9821",
      "file_url": "https://cdn.aagarathirupthi.com/docs/tl_123.pdf"
    },
    {
      "type": "fssai",
      "number": "12423005000123",
      "expiry_date": "2027-12-31",
      "file_url": "https://cdn.aagarathirupthi.com/docs/fssai_123.pdf"
    }
  ]
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": { "registration_step": 7, "saved": true }
}
```

---

### SCREEN 10: RegReviewScreen (Registration Step 7)
- **File:** `src/screens/registration/RegReviewScreen.tsx`
- **Route:** `RegReview`
- **APIs on this screen:** **2**

#### API 10.1: Fetch Registration Application Summary
- **Method & Route:** `GET /api/v1/providers/registration/summary`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "business_info": { "business_name": "Grand Royal Caterers", "district": "Salem" },
    "category": { "primary": "catering", "secondary": ["decoration"] },
    "service_details": { "veg_preference": "both", "min_capacity": 50, "max_capacity": 5000 },
    "pricing": { "pricing_model": "per_plate", "starting_price": 250 },
    "coverage": { "districts": ["Salem", "Erode"], "areas": ["Salem North", "Attur"] },
    "documents": { "aadhaar": true, "pan": true, "trade_license": true, "fssai": true }
  }
}
```

#### API 10.2: Submit Application For Admin Verification
- **Method & Route:** `POST /api/v1/providers/registration/submit`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "terms_accepted": true,
  "submitted_at": "2026-10-25T17:55:00Z"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "message": "Application submitted for review. Verification takes 24-48 business hours."
  }
}
```

---

### SCREEN 11: PendingApprovalScreen
- **File:** `src/screens/auth/PendingApprovalScreen.tsx`
- **Route:** `PendingApproval`
- **APIs on this screen:** **2**

#### API 11.1: Check Provider Approval Status
- **Method & Route:** `GET /api/v1/providers/me/status`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "pending", // 'pending' | 'under_review' | 'approved' | 'rejected'
    "submission_date": "2026-10-25T17:55:00Z",
    "rejection_reason": null,
    "estimated_decision": "2026-10-27T18:00:00Z"
  }
}
```

#### API 11.2: Contact Support / Request Expedited Review
- **Method & Route:** `POST /api/v1/support/enquiry`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "subject": "Verification Follow-up",
  "message": "Hi, please check my uploaded FSSAI license for faster approval."
}
```
- **Response (200 OK):**
```json
{ "success": true, "message": "Support enquiry logged. Ticket #AG-8821 created." }
```

---

### SCREEN 12: HomeScreen (Main Dashboard)
- **File:** `src/screens/home/HomeScreen.tsx`
- **Route:** `Home`
- **APIs on this screen:** **6**

#### API 12.1: Get Provider Profile Card
- **Method & Route:** `GET /api/v1/providers/me`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "e4a7b3c2-1234-5678-90ab-cdef12345678",
    "business_name": "Aagara Thirupthi Caterers",
    "owner_name": "Murugan R",
    "category": "catering",
    "rating": 4.8,
    "review_count": 42,
    "is_online": true,
    "verified": true,
    "cover_image": "https://cdn.aagarathirupthi.com/covers/caterer1.jpg"
  }
}
```

#### API 12.2: Get Dashboard Summary Metrics
- **Method & Route:** `GET /api/v1/dashboard/metrics`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "active_enquiries": 8,
    "quote_pending": 3,
    "upcoming_bookings": 5,
    "month_earnings": 145000,
    "response_rate_percent": 96
  }
}
```

#### API 12.3: Get Recent Urgent Enquiries
- **Method & Route:** `GET /api/v1/enquiries?limit=3&status=pending`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "enq_101",
      "customer_name": "Priya Ramesh",
      "event_type": "Wedding Reception",
      "event_date": "2026-11-14",
      "guest_count": 450,
      "status": "pending",
      "created_at": "2026-10-25T14:30:00Z"
    }
  ]
}
```

#### API 12.4: Get Upcoming Bookings
- **Method & Route:** `GET /api/v1/bookings?limit=3&status=confirmed`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "bkg_201",
      "customer_name": "Karthik Raja",
      "event_type": "Engagement",
      "event_date": "2026-11-02",
      "location": "Green Palace Hall, Salem",
      "status": "confirmed",
      "total_amount": 85000,
      "advance_paid": 30000
    }
  ]
}
```

#### API 12.5: Get Special Combos Showcase
- **Method & Route:** `GET /api/v1/providers/combos?limit=5`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "combo_1",
      "name": "Grand Wedding Feast + Welcome Drink",
      "price": 380,
      "original_price": 450,
      "image_url": "https://cdn.aagarathirupthi.com/combos/c1.jpg",
      "valid_until": "2026-12-31"
    }
  ]
}
```

#### API 12.6: Toggle Online / Accepting Orders Status
- **Method & Route:** `PATCH /api/v1/providers/me/online-status`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "is_online": false
}
```
- **Response (200 OK):**
```json
{ "success": true, "data": { "is_online": false } }
```

---

### SCREEN 13: EnquiriesListScreen (Main Tab: Enquiries)
- **File:** `src/screens/enquiries/EnquiriesListScreen.tsx`
- **Route:** `Enquiries`
- **APIs on this screen:** **2**

#### API 13.1: List Filtered Enquiries
- **Method & Route:** `GET /api/v1/enquiries`
- **Query Parameters:** `status=pending|reviewing|quote_sent|accepted|cancelled`, `search=...`, `page=1`, `limit=20`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "enq_101",
      "customer_name": "Priya Ramesh",
      "customer_mobile": "+91 9876543210",
      "category": "catering",
      "event_type": "Wedding Reception",
      "event_date": "2026-11-14",
      "location": "Salem",
      "guest_count": 450,
      "estimated_total": 135000,
      "status": "pending",
      "created_at": "2026-10-25T14:30:00Z"
    }
  ],
  "meta": { "total": 24, "page": 1, "total_pages": 2 }
}
```

#### API 13.2: Get Status Tab Counter Badges
- **Method & Route:** `GET /api/v1/enquiries/counts`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "all": 24,
    "pending": 5,
    "reviewing": 4,
    "quote_sent": 8,
    "accepted": 5,
    "cancelled": 2
  }
}
```

---

### SCREEN 14: EnquiryDetailScreen
- **File:** `src/screens/enquiries/EnquiryDetailScreen.tsx`
- **Route:** `EnquiryDetail`
- **APIs on this screen:** **4**

#### API 14.1: Fetch Full Enquiry Details & Audit Timeline
- **Method & Route:** `GET /api/v1/enquiries/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "enq_101",
    "customer": {
      "name": "Priya Ramesh",
      "mobile": "9876543210",
      "whatsapp": "9876543210",
      "email": "priya.r@example.com"
    },
    "event_type": "Wedding Reception",
    "event_date": "2026-11-14",
    "location": "Sri Ramakrishna Hall, Hasthampatti, Salem",
    "guest_count": 450,
    "meal_type": "dinner",
    "special_requests": "Need live dosa counter & tender coconut welcome drink",
    "quote_amount": 135000,
    "status": "reviewing",
    "timeline": [
      { "status": "pending", "timestamp": "2026-10-25T14:30:00Z", "note": "Enquiry submitted by user" },
      { "status": "reviewing", "timestamp": "2026-10-25T15:00:00Z", "note": "Provider viewed enquiry" }
    ]
  }
}
```

#### API 14.2: Update Enquiry Status
- **Method & Route:** `PATCH /api/v1/enquiries/:id/status`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "status": "quote_sent", // 'reviewing' | 'quote_sent' | 'accepted' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
  "note": "Quotation submitted with live counter inclusion"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "enq_101",
    "status": "quote_sent",
    "updated_at": "2026-10-25T17:55:00Z"
  }
}
```

#### API 14.3: Submit Price Quote
- **Method & Route:** `POST /api/v1/enquiries/:id/quote`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "quote_amount": 135000,
  "valid_until": "2026-11-05",
  "inclusions": ["450 Plates Standard Non-Veg Feast", "Live Dosa Counter", "Mineral Water"],
  "terms": "30% advance on acceptance"
}
```
- **Response (200 OK):**
```json
{ "success": true, "message": "Quote sent to customer and SMS notification dispatched" }
```

#### API 14.4: Add Direct Note or Enquiry Message
- **Method & Route:** `POST /api/v1/enquiries/:id/messages`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "sender": "provider",
  "message": "Called customer at 4:30 PM. Confirmed venue timing is 6:00 PM onwards."
}
```
- **Response (200 OK):**
```json
{ "success": true, "data": { "id": "msg_901", "created_at": "2026-10-25T17:55:00Z" } }
```

---

### SCREEN 15: BookingsListScreen (Main Tab: Bookings)
- **File:** `src/screens/bookings/BookingsListScreen.tsx`
- **Route:** `Bookings`
- **APIs on this screen:** **2**

#### API 15.1: List Bookings
- **Method & Route:** `GET /api/v1/bookings`
- **Query Parameters:** `status=upcoming|in_progress|completed|cancelled`, `search=...`, `page=1`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "bkg_201",
      "customer_name": "Karthik Raja",
      "customer_mobile": "+91 9443210987",
      "event_type": "Engagement",
      "event_date": "2026-11-02",
      "venue": "Green Palace Hall, Salem",
      "total_amount": 85000,
      "advance_paid": 30000,
      "balance_due": 55000,
      "status": "confirmed"
    }
  ]
}
```

#### API 15.2: Get Booking Counters
- **Method & Route:** `GET /api/v1/bookings/counts`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "all": 32,
    "upcoming": 7,
    "in_progress": 2,
    "completed": 21,
    "cancelled": 2
  }
}
```

---

### SCREEN 16: BookingDetailScreen
- **File:** `src/screens/bookings/BookingDetailScreen.tsx`
- **Route:** `BookingDetail`
- **APIs on this screen:** **4**

#### API 16.1: Get Complete Booking Information
- **Method & Route:** `GET /api/v1/bookings/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "bkg_201",
    "customer": { "name": "Karthik Raja", "mobile": "9443210987", "email": "karthik@example.com" },
    "event_details": {
      "type": "Engagement",
      "date": "2026-11-02",
      "start_time": "10:30 AM",
      "venue": "Green Palace Hall, Salem",
      "guest_count": 250
    },
    "billing": {
      "total_amount": 85000,
      "advance_paid": 30000,
      "balance_amount": 55000,
      "payment_status": "partially_paid"
    },
    "payments_history": [
      { "id": "pay_1", "amount": 30000, "method": "upi", "date": "2026-10-15T11:20:00Z", "receipt_no": "REC-991" }
    ],
    "status": "confirmed"
  }
}
```

#### API 16.2: Update Booking Status
- **Method & Route:** `PATCH /api/v1/bookings/:id/status`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "status": "completed" // 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
}
```
- **Response (200 OK):**
```json
{ "success": true, "data": { "id": "bkg_201", "status": "completed" } }
```

#### API 16.3: Record Received Payment
- **Method & Route:** `POST /api/v1/bookings/:id/payments`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "amount": 55000,
  "payment_method": "cash", // 'upi' | 'cash' | 'bank_transfer'
  "reference_id": "CASH-PAID-ON-VENUE",
  "notes": "Full balance cleared post dinner"
}
```
- **Response (200 OK):**
```json
{ "success": true, "message": "Payment recorded successfully", "balance_due": 0 }
```

#### API 16.4: Download Booking Invoice / Receipt PDF
- **Method & Route:** `GET /api/v1/bookings/:id/invoice`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": { "pdf_url": "https://cdn.aagarathirupthi.com/invoices/INV_201.pdf" }
}
```

---

### SCREEN 17: CustomersScreen (Main Tab: CRM)
- **File:** `src/screens/crm/CustomersScreen.tsx`
- **Route:** `Crm`
- **APIs on this screen:** **2**

#### API 17.1: Get CRM Customers List
- **Method & Route:** `GET /api/v1/crm/customers`
- **Query Parameters:** `search=...`, `tag=repeat|vip|recent`, `page=1`, `limit=20`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cust_501",
      "name": "Karthik Raja",
      "mobile": "9443210987",
      "city": "Salem",
      "total_bookings": 2,
      "total_spent": 140000,
      "last_event_date": "2026-11-02",
      "tags": ["repeat", "high_value"]
    }
  ]
}
```

#### API 17.2: Get CRM Summary Statistics
- **Method & Route:** `GET /api/v1/crm/stats`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_customers": 76,
    "repeat_clients": 14,
    "repeat_rate_percent": 18.4,
    "avg_lifetime_value": 72500
  }
}
```

---

### SCREEN 18: CustomerDetailScreen
- **File:** `src/screens/crm/CustomerDetailScreen.tsx`
- **Route:** `CustomerDetail`
- **APIs on this screen:** **4**

#### API 18.1: Get Customer Profile
- **Method & Route:** `GET /api/v1/crm/customers/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cust_501",
    "name": "Karthik Raja",
    "mobile": "9443210987",
    "email": "karthik@example.com",
    "district": "Salem",
    "total_bookings": 2,
    "total_spent": 140000
  }
}
```

#### API 18.2: Get Customer Booking & Enquiry History
- **Method & Route:** `GET /api/v1/crm/customers/:id/history`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "type": "booking", "id": "bkg_201", "event": "Engagement", "date": "2026-11-02", "amount": 85000 },
    { "type": "booking", "id": "bkg_089", "event": "Housewarming", "date": "2025-08-10", "amount": 55000 }
  ]
}
```

#### API 18.3: Get Customer Private Notes
- **Method & Route:** `GET /api/v1/crm/customers/:id/notes`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "id": "nt_1", "note": "Prefers mild spicy Chettinad gravies. Pays advance promptly.", "created_at": "2025-08-11" }
  ]
}
```

#### API 18.4: Add Customer Private Note
- **Method & Route:** `POST /api/v1/crm/customers/:id/notes`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "note": "Requested quotation for cousin's wedding in Feb 2027"
}
```
- **Response (200 OK):**
```json
{ "success": true, "data": { "id": "nt_2", "created_at": "2026-10-25T17:55:00Z" } }
```

---

### SCREEN 19: ServicesManagementScreen
- **File:** `src/screens/services/ServicesManagementScreen.tsx`
- **Route:** `ServicesManagement`
- **APIs on this screen:** **9** *(3 Resource Types × 3 Operations: List, Toggle Status, Delete)*

#### API 19.1: List Provider Dishes
- **Method & Route:** `GET /api/v1/providers/dishes`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "id": "d1", "name": "Mutton Biryani", "category": "main", "price": 280, "is_veg": false, "is_active": true, "photo_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8" }
  ]
}
```

#### API 19.2: Toggle Dish Active / Inactive
- **Method & Route:** `PATCH /api/v1/providers/dishes/:id/status`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "is_active": false }`
- **Response (200 OK):** `{ "success": true, "data": { "id": "d1", "is_active": false } }`

#### API 19.3: Delete Dish
- **Method & Route:** `DELETE /api/v1/providers/dishes/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):** `{ "success": true, "message": "Dish deleted successfully" }`

#### API 19.4: List Menu Packages
- **Method & Route:** `GET /api/v1/providers/packages`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "id": "pkg_1", "name": "Royal South Indian Wedding Feast", "price": 420, "is_active": true, "items_count": 18 }
  ]
}
```

#### API 19.5: Toggle Package Active / Inactive
- **Method & Route:** `PATCH /api/v1/providers/packages/:id/status`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "is_active": false }`
- **Response (200 OK):** `{ "success": true, "data": { "id": "pkg_1", "is_active": false } }`

#### API 19.6: Delete Package
- **Method & Route:** `DELETE /api/v1/providers/packages/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):** `{ "success": true, "message": "Package removed" }`

#### API 19.7: List Special Combos
- **Method & Route:** `GET /api/v1/providers/combos`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "id": "c1", "name": "Grand Wedding Feast + Welcome Drink", "price": 380, "original_price": 450, "is_active": true }
  ]
}
```

#### API 19.8: Toggle Special Combo Active / Inactive
- **Method & Route:** `PATCH /api/v1/providers/combos/:id/status`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "is_active": false }`
- **Response (200 OK):** `{ "success": true, "data": { "id": "c1", "is_active": false } }`

#### API 19.9: Delete Special Combo
- **Method & Route:** `DELETE /api/v1/providers/combos/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):** `{ "success": true, "message": "Combo deleted" }`

---

### SCREEN 20: DishEditorScreen
- **File:** `src/screens/services/DishEditorScreen.tsx`
- **Route:** `DishEditor`
- **APIs on this screen:** **4**

#### API 20.1: Fetch Single Dish (Edit Mode)
- **Method & Route:** `GET /api/v1/providers/dishes/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "d1",
    "name": "Mutton Biryani",
    "category": "main",
    "price": 280,
    "is_veg": false,
    "is_popular": true,
    "is_active": true,
    "photo_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8"
  }
}
```

#### API 20.2: Request Photo Upload URL
- **Method & Route:** `POST /api/v1/media/upload-url`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "file_name": "biryani.jpg", "mime_type": "image/jpeg", "category": "dishes" }`
- **Response (200 OK):** `{ "upload_url": "...", "file_url": "https://cdn.aagarathirupthi.com/dishes/biryani.jpg" }`

#### API 20.3: Create New Dish
- **Method & Route:** `POST /api/v1/providers/dishes`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "name": "Mutton Sukka",
  "category": "starters",
  "price": 220,
  "is_veg": false,
  "is_popular": true,
  "photo_url": "https://cdn.aagarathirupthi.com/dishes/sukka.jpg"
}
```
- **Response (201 Created):** `{ "success": true, "data": { "id": "d10" } }`

#### API 20.4: Update Existing Dish
- **Method & Route:** `PUT /api/v1/providers/dishes/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "name": "Mutton Sukka (Madurai Style)",
  "category": "starters",
  "price": 240,
  "is_veg": false,
  "is_popular": true,
  "photo_url": "https://cdn.aagarathirupthi.com/dishes/sukka.jpg"
}
```
- **Response (200 OK):** `{ "success": true, "data": { "id": "d10", "saved": true } }`

---

### SCREEN 21: PackageEditorScreen
- **File:** `src/screens/services/PackageEditorScreen.tsx`
- **Route:** `PackageEditor`
- **APIs on this screen:** **4**

#### API 21.1: Fetch Single Package (Edit Mode)
- **Method & Route:** `GET /api/v1/providers/packages/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "pkg_1",
    "name": "Classic Wedding Feast",
    "price_per_plate": 350,
    "description": "Complete 3-course South Indian traditional feast",
    "min_guests": 100,
    "dish_ids": ["d1", "d2", "d3", "d4"]
  }
}
```

#### API 21.2: Get Available Dishes For Selection
- **Method & Route:** `GET /api/v1/providers/dishes`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{ "success": true, "data": [{ "id": "d1", "name": "Mutton Biryani" }, { "id": "d2", "name": "Paneer Butter Masala" }] }
```

#### API 21.3: Create Package
- **Method & Route:** `POST /api/v1/providers/packages`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "name": "Premium Wedding Feast",
  "price_per_plate": 450,
  "description": "Welcome drink + 4 Starters + Biryani + 3 Curries + Ice cream counter",
  "min_guests": 150,
  "dish_ids": ["d1", "d2", "d5", "d7"]
}
```
- **Response (201 Created):** `{ "success": true, "data": { "id": "pkg_9" } }`

#### API 21.4: Update Package
- **Method & Route:** `PUT /api/v1/providers/packages/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "name": "Premium Wedding Feast Gold", "price_per_plate": 480, "dish_ids": ["d1", "d2"] }`
- **Response (200 OK):** `{ "success": true, "data": { "saved": true } }`

---

### SCREEN 22: ComboEditorScreen
- **File:** `src/screens/services/ComboEditorScreen.tsx`
- **Route:** `ComboEditor`
- **APIs on this screen:** **4**

#### API 22.1: Fetch Single Combo (Edit Mode)
- **Method & Route:** `GET /api/v1/providers/combos/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "c1",
    "name": "Grand Wedding Feast + Welcome Drink",
    "description": "Full festive meal with complimentary mocktail counter",
    "price": 380,
    "original_price": 450,
    "included_items": ["Mutton Biryani", "Chicken 65", "Elaneer Payasam", "Live Mocktails"],
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    "valid_until": "2026-12-31"
  }
}
```

#### API 22.2: Upload Combo Image URL
- **Method & Route:** `POST /api/v1/media/upload-url`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "file_name": "combo.jpg", "mime_type": "image/jpeg", "category": "combos" }`
- **Response (200 OK):** `{ "upload_url": "...", "file_url": "https://cdn.aagarathirupthi.com/combos/c1.jpg" }`

#### API 22.3: Create Special Combo
- **Method & Route:** `POST /api/v1/providers/combos`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "name": "Diwali Family Celebration Combo",
  "description": "Assorted sweets + 5 varieties lunch combo",
  "price": 320,
  "original_price": 400,
  "included_items": ["Mysore Pak", "Gulab Jamun", "Veg Pulao", "Paneer Gravy"],
  "image_url": "https://cdn.aagarathirupthi.com/combos/diwali.jpg",
  "valid_until": "2026-11-15"
}
```
- **Response (201 Created):** `{ "success": true, "data": { "id": "c9" } }`

#### API 22.4: Update Special Combo
- **Method & Route:** `PUT /api/v1/providers/combos/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "name": "Diwali Mega Combo", "price": 310 }`
- **Response (200 OK):** `{ "success": true, "data": { "saved": true } }`

---

### SCREEN 23: AvailabilityCalendarScreen
- **File:** `src/screens/services/AvailabilityCalendarScreen.tsx`
- **Route:** `AvailabilityCalendar`
- **APIs on this screen:** **3**

#### API 23.1: Get Month Calendar Schedule & Stats
- **Method & Route:** `GET /api/v1/providers/availability/month`
- **Query Parameters:** `year=2026`, `month=11`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "month": 11,
    "stats": { "available_count": 22, "booked_count": 5, "blocked_count": 3 },
    "dates": [
      { "date": "2026-11-01", "status": "available", "note": null },
      { "date": "2026-11-02", "status": "booked", "booking_id": "bkg_201", "note": "Karthik Raja Engagement" },
      { "date": "2026-11-15", "status": "blocked", "note": "Personal family leave" }
    ]
  }
}
```

#### API 23.2: Update Single Date Status
- **Method & Route:** `PUT /api/v1/providers/availability/date`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "date": "2026-11-18",
  "status": "blocked", // 'available' | 'booked' | 'blocked'
  "note": "Kitchen renovation / holiday"
}
```
- **Response (200 OK):** `{ "success": true, "data": { "date": "2026-11-18", "status": "blocked" } }`

#### API 23.3: Bulk Update Date Ranges
- **Method & Route:** `POST /api/v1/providers/availability/bulk`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "start_date": "2026-11-20",
  "end_date": "2026-11-25",
  "status": "blocked",
  "note": "Fully booked for off-site wedding series"
}
```
- **Response (200 OK):** `{ "success": true, "message": "6 dates updated to blocked" }`

---

### SCREEN 24: ReviewsScreen
- **File:** `src/screens/reviews/ReviewsScreen.tsx`
- **Route:** `Reviews`
- **APIs on this screen:** **3**

#### API 24.1: List Reviews
- **Method & Route:** `GET /api/v1/providers/reviews`
- **Query Parameters:** `rating=all|5|4|3|2|1`, `page=1`, `limit=20`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "rev_1",
      "customer_name": "Senthil Kumar",
      "rating": 5,
      "event_type": "Daughter's Wedding",
      "comment": "Food quality was extraordinary! Guests especially loved the hot Elaneer Payasam.",
      "created_at": "2026-10-18T10:00:00Z",
      "provider_reply": null
    }
  ]
}
```

#### API 24.2: Get Reviews Score Breakdown
- **Method & Route:** `GET /api/v1/providers/reviews/summary`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "average_rating": 4.8,
    "total_reviews": 42,
    "breakdown": { "5_star": 35, "4_star": 5, "3_star": 2, "2_star": 0, "1_star": 0 }
  }
}
```

#### API 24.3: Reply to Customer Review
- **Method & Route:** `POST /api/v1/providers/reviews/:id/reply`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "reply_text": "Thank you so much Senthil sir! It was a delight catering your daughter's big day."
}
```
- **Response (200 OK):** `{ "success": true, "message": "Reply published" }`

---

### SCREEN 25: ReportsScreen (Analytics & Reports)
- **File:** `src/screens/reports/ReportsScreen.tsx`
- **Route:** `Reports`
- **APIs on this screen:** **3**

#### API 25.1: Get Analytics Overview KPI Cards
- **Method & Route:** `GET /api/v1/analytics/overview`
- **Query Parameters:** `period=this_month|last_3_months|this_year`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_revenue": 450000,
    "completed_events": 8,
    "total_guests_served": 3400,
    "conversion_rate_percent": 34.2,
    "avg_event_value": 56250
  }
}
```

#### API 25.2: Get Revenue Trend Chart Data
- **Method & Route:** `GET /api/v1/analytics/revenue-chart`
- **Query Parameters:** `year=2026`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "month": "Jun", "revenue": 120000, "events": 3 },
    { "month": "Jul", "revenue": 185000, "events": 4 },
    { "month": "Aug", "revenue": 140000, "events": 3 },
    { "month": "Sep", "revenue": 210000, "events": 5 },
    { "month": "Oct", "revenue": 450000, "events": 8 }
  ]
}
```

#### API 25.3: Export Performance Report (CSV/PDF)
- **Method & Route:** `GET /api/v1/analytics/export`
- **Query Parameters:** `format=pdf|csv`, `period=this_year`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": { "download_url": "https://cdn.aagarathirupthi.com/reports/report_2026.pdf" }
}
```

---

### SCREEN 26: NotificationsScreen
- **File:** `src/screens/home/NotificationsScreen.tsx`
- **Route:** `Notifications`
- **APIs on this screen:** **4**

#### API 26.1: List In-App Notifications
- **Method & Route:** `GET /api/v1/notifications`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif_1",
      "type": "new_enquiry",
      "title": "New Enquiry from Priya Ramesh",
      "message": "Wedding Reception for 450 guests on Nov 14, 2026",
      "read": false,
      "reference_id": "enq_101",
      "created_at": "2026-10-25T14:30:00Z"
    }
  ]
}
```

#### API 26.2: Mark Single Notification As Read
- **Method & Route:** `PATCH /api/v1/notifications/:id/read`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):** `{ "success": true, "data": { "id": "notif_1", "read": true } }`

#### API 26.3: Mark All Notifications Read
- **Method & Route:** `PATCH /api/v1/notifications/mark-all-read`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):** `{ "success": true, "message": "All notifications marked as read" }`

#### API 26.4: Delete Notification
- **Method & Route:** `DELETE /api/v1/notifications/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):** `{ "success": true, "message": "Notification removed" }`

---

### SCREEN 27: MoreScreen (Main Tab: More / Account)
- **File:** `src/screens/profile/MoreScreen.tsx`
- **Route:** `More`
- **APIs on this screen:** **2**

#### API 27.1: Get Provider Profile Card
- **Method & Route:** `GET /api/v1/providers/me`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "business_name": "Aagara Thirupthi Caterers",
    "mobile": "9876543210",
    "verified": true,
    "profile_completion_percent": 95
  }
}
```

#### API 27.2: Logout & Invalidate Session
- **Method & Route:** `POST /api/v1/auth/logout`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "push_token": "ExponentPushToken[xxxxxx]" }`
- **Response (200 OK):** `{ "success": true, "message": "Logged out successfully" }`

---

### SCREEN 28: EditProfileScreen
- **File:** `src/screens/profile/EditProfileScreen.tsx`
- **Route:** `EditProfile`
- **APIs on this screen:** **3**

#### API 28.1: Fetch Profile Details
- **Method & Route:** `GET /api/v1/providers/me`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):** (Full provider profile object)

#### API 28.2: Get Image Upload Pre-signed URL
- **Method & Route:** `POST /api/v1/media/upload-url`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "file_name": "banner.jpg", "mime_type": "image/jpeg", "category": "covers" }`
- **Response (200 OK):** `{ "upload_url": "...", "file_url": "https://cdn.aagarathirupthi.com/covers/banner.jpg" }`

#### API 28.3: Update Profile Information
- **Method & Route:** `PUT /api/v1/providers/me`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "business_name": "Aagara Thirupthi Caterers & Sweets",
  "owner_name": "Murugan R",
  "tagline": "Traditional Chettinad & South Indian Flavours",
  "description": "Premium catering service with over 20 years experience.",
  "whatsapp": "9876543210",
  "email": "murugan@example.com",
  "cover_image": "https://cdn.aagarathirupthi.com/covers/banner.jpg",
  "logo_color": "#FF6B6B"
}
```
- **Response (200 OK):** `{ "success": true, "message": "Profile updated successfully" }`

---

### SCREEN 29: BusinessSettingsScreen
- **File:** `src/screens/profile/BusinessSettingsScreen.tsx`
- **Route:** `BusinessSettings`
- **APIs on this screen:** **2**

#### API 29.1: Fetch Current Business Settings
- **Method & Route:** `GET /api/v1/providers/settings`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "pricing_model": "per_plate",
    "starting_price": 250,
    "min_capacity": 50,
    "max_capacity": 5000,
    "advance_notice_days": 3,
    "auto_accept_enquiries": false,
    "cancellation_policy": "Full refund if cancelled 15 days prior"
  }
}
```

#### API 29.2: Save Updated Business Settings
- **Method & Route:** `PUT /api/v1/providers/settings`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "pricing_model": "per_plate",
  "starting_price": 275,
  "min_capacity": 50,
  "max_capacity": 5000,
  "advance_notice_days": 4,
  "auto_accept_enquiries": false
}
```
- **Response (200 OK):** `{ "success": true, "message": "Settings updated" }`

---

### SCREEN 30: EarningsScreen
- **File:** `src/screens/profile/EarningsScreen.tsx`
- **Route:** `Earnings`
- **APIs on this screen:** **2**

#### API 30.1: Get Earnings Overview & Balances
- **Method & Route:** `GET /api/v1/providers/earnings/summary`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_lifetime_earnings": 1450000,
    "this_month_earnings": 145000,
    "pending_payout": 42000,
    "escrow_advance_held": 85000,
    "next_payout_date": "2026-10-31"
  }
}
```

#### API 30.2: Get Payouts / Transactions History
- **Method & Route:** `GET /api/v1/providers/earnings/transactions`
- **Query Parameters:** `page=1`, `limit=20`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "txn_881",
      "payout_date": "2026-10-15",
      "amount": 75000,
      "status": "completed",
      "payout_method": "direct_neft",
      "utr_number": "HDFC1029384756"
    }
  ]
}
```

---

### SCREEN 31: DocumentsScreen
- **File:** `src/screens/profile/DocumentsScreen.tsx`
- **Route:** `Documents`
- **APIs on this screen:** **3**

#### API 31.1: List Verification Documents & Expiry Status
- **Method & Route:** `GET /api/v1/providers/documents`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "type": "aadhaar", "title": "Aadhaar Card", "status": "verified", "number": "XXXX-XXXX-1098" },
    { "type": "pan", "title": "PAN Card", "status": "verified", "number": "XXXXX1234F" },
    { "type": "trade_license", "title": "Trade License", "status": "verified", "number": "TL/2026/9821" },
    { "type": "fssai", "title": "FSSAI Certificate", "status": "verified", "number": "12423005000123", "expiry_date": "2027-12-31" }
  ]
}
```

#### API 31.2: Get Pre-signed URL for Document Renewal
- **Method & Route:** `POST /api/v1/media/upload-url`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{ "file_name": "fssai_renewed.pdf", "mime_type": "application/pdf", "category": "provider_documents" }`
- **Response (200 OK):** `{ "upload_url": "...", "file_url": "https://cdn.aagarathirupthi.com/docs/fssai_renewed.pdf" }`

#### API 31.3: Update Document Metadata
- **Method & Route:** `PUT /api/v1/providers/documents/:type`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "number": "12423005000999",
  "expiry_date": "2029-12-31",
  "file_url": "https://cdn.aagarathirupthi.com/docs/fssai_renewed.pdf"
}
```
- **Response (200 OK):** `{ "success": true, "message": "Document uploaded and submitted for reverification." }`

---

### SCREEN 32: HelpSupportScreen
- **File:** `src/screens/profile/HelpSupportScreen.tsx`
- **Route:** `HelpSupport`
- **APIs on this screen:** **2**

#### API 32.1: Get FAQ Knowledgebase
- **Method & Route:** `GET /api/v1/support/faqs`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "faq_1",
      "question": "How are customer payments settled to my bank account?",
      "answer": "All advance and completed booking payments are reconciled and settled weekly directly to your registered bank account every Tuesday."
    },
    {
      "id": "faq_2",
      "question": "Is FSSAI mandatory for registration?",
      "answer": "FSSAI Certificate is optional during initial onboarding for caterers. However, having it verified grants your profile an official verified badge on the User App."
    }
  ]
}
```

#### API 32.2: Submit Support Ticket or Callback Request
- **Method & Route:** `POST /api/v1/support/tickets`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "subject": "Dispute on booking balance bkg_201",
  "category": "billing", // 'billing' | 'technical' | 'account' | 'general'
  "message": "Customer claims they paid balance via cash, please confirm receipt reconciliation."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "ticket_id": "TKT-5541",
    "status": "open",
    "message": "Support ticket created. Our team will contact you within 4 hours."
  }
}
```

---

## 3. Global Error Handling & Standard Responses

All REST APIs follow consistent HTTP status code responses:

### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data failed validation.",
    "details": [
      {
        "field": "starting_price",
        "message": "starting_price must be greater than 0"
      }
    ]
  }
}
```

### Common HTTP Status Codes
| Code | Meaning | When Used |
|---|---|---|
| `200 OK` | Success | Successful `GET`, `PUT`, `PATCH` request |
| `201 Created` | Created | Successful `POST` entity creation |
| `400 Bad Request` | Client Error | Malformed JSON or invalid parameter |
| `401 Unauthorized` | Auth Required | Missing or expired JWT Bearer token |
| `403 Forbidden` | Access Denied | Provider attempting to access another provider's resource |
| `404 Not Found` | Resource Not Found | ID does not exist |
| `422 Unprocessable`| Validation Failure| Required fields missing or out of bounds |
| `500 Server Error` | Internal Failure | Unhandled database or server exception |
