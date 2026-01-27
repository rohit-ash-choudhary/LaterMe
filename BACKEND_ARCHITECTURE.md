# FUTUROO - Backend Architecture & Component Mapping

This document maps all API endpoints to their required backend components following enterprise/MNC standards (Spring Boot / NestJS pattern).

---

## 📦 Package Structure

```
com.futuroo
├── entity/              # Database entities (JPA/Hibernate models)
├── dto/                 # Data Transfer Objects (Request/Response)
│   ├── request/         # Request DTOs
│   └── response/        # Response DTOs
├── repository/          # Data access layer (JPA Repositories)
├── service/             # Business logic layer
│   ├── interface/       # Service interfaces
│   └── impl/            # Service implementations
├── controller/          # REST API controllers
├── exception/           # Custom exceptions
├── config/              # Configuration classes
└── util/                # Utility classes
```

---

## 🔐 1. Authentication & User Management APIs

### 1.1 POST `/auth/register`
**Components Required:**
- **Entity:** `User`
- **Request DTO:** `RegisterRequest`
- **Response DTO:** `AuthResponse`
- **Repository:** `UserRepository`
- **Service:** `AuthService` (interface) → `AuthServiceImpl`
- **Controller:** `AuthController`

### 1.2 POST `/auth/login`
**Components Required:**
- **Entity:** `User`
- **Request DTO:** `LoginRequest`
- **Response DTO:** `AuthResponse`
- **Repository:** `UserRepository`
- **Service:** `AuthService` (interface) → `AuthServiceImpl`
- **Controller:** `AuthController`

### 1.3 POST `/auth/google`
**Components Required:**
- **Entity:** `User`
- **Request DTO:** `GoogleLoginRequest`
- **Response DTO:** `AuthResponse`
- **Repository:** `UserRepository`
- **Service:** `AuthService` (interface) → `AuthServiceImpl`
- **Service:** `OAuthService` (interface) → `OAuthServiceImpl`
- **Controller:** `AuthController`

### 1.4 GET `/auth/me`
**Components Required:**
- **Entity:** `User`
- **Response DTO:** `UserResponse`
- **Repository:** `UserRepository`
- **Service:** `UserService` (interface) → `UserServiceImpl`
- **Controller:** `AuthController`

### 1.5 PUT `/auth/email`
**Components Required:**
- **Entity:** `User`
- **Request DTO:** `UpdateEmailRequest`
- **Response DTO:** `UserResponse`
- **Repository:** `UserRepository`
- **Service:** `UserService` (interface) → `UserServiceImpl`
- **Controller:** `AuthController`

### 1.6 PUT `/auth/password`
**Components Required:**
- **Entity:** `User`
- **Request DTO:** `ChangePasswordRequest`
- **Response DTO:** `MessageResponse`
- **Repository:** `UserRepository`
- **Service:** `UserService` (interface) → `UserServiceImpl`
- **Controller:** `AuthController`

### 1.7 DELETE `/auth/account`
**Components Required:**
- **Entity:** `User`
- **Response DTO:** `MessageResponse`
- **Repository:** `UserRepository`
- **Service:** `UserService` (interface) → `UserServiceImpl`
- **Controller:** `AuthController`

---

## ✉️ 2. Letters (Write Later - Future Letters) APIs

### 2.1 GET `/letters`
**Components Required:**
- **Entity:** `Letter`
- **Response DTO:** `LetterListResponse`, `LetterResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterService` (interface) → `LetterServiceImpl`
- **Controller:** `LetterController`

### 2.2 GET `/letters/:letterId`
**Components Required:**
- **Entity:** `Letter`
- **Response DTO:** `LetterResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterService` (interface) → `LetterServiceImpl`
- **Controller:** `LetterController`

### 2.3 POST `/letters/drafts`
**Components Required:**
- **Entity:** `Letter`
- **Request DTO:** `CreateDraftRequest`
- **Response DTO:** `LetterResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterService` (interface) → `LetterServiceImpl`
- **Service:** `LetterLimitService` (interface) → `LetterLimitServiceImpl`
- **Controller:** `LetterController`

### 2.4 PUT `/letters/drafts/:draftId`
**Components Required:**
- **Entity:** `Letter`
- **Request DTO:** `UpdateDraftRequest`
- **Response DTO:** `LetterResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterService` (interface) → `LetterServiceImpl`
- **Controller:** `LetterController`

### 2.5 DELETE `/letters/drafts/:draftId`
**Components Required:**
- **Entity:** `Letter`
- **Response DTO:** `MessageResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterService` (interface) → `LetterServiceImpl`
- **Controller:** `LetterController`

### 2.6 POST `/letters/schedule`
**Components Required:**
- **Entity:** `Letter`
- **Request DTO:** `ScheduleLetterRequest`
- **Response DTO:** `ScheduleLetterResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterService` (interface) → `LetterServiceImpl`
- **Service:** `LetterLimitService` (interface) → `LetterLimitServiceImpl`
- **Service:** `SubscriptionService` (interface) → `SubscriptionServiceImpl`
- **Controller:** `LetterController`

### 2.7 POST `/letters/:letterId/open`
**Components Required:**
- **Entity:** `Letter`
- **Response DTO:** `OpenLetterResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterService` (interface) → `LetterServiceImpl`
- **Controller:** `LetterController`

### 2.8 PUT `/letters/:letterId/opened`
**Components Required:**
- **Entity:** `Letter`
- **Response DTO:** `MessageResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterService` (interface) → `LetterServiceImpl`
- **Controller:** `LetterController`

---

## 🌍 3. Public Letters APIs

### 3.1 GET `/public-letters`
**Components Required:**
- **Entity:** `Letter`, `PublicLetter`, `LetterReaction`
- **Response DTO:** `PublicLetterListResponse`, `PublicLetterResponse`
- **Repository:** `PublicLetterRepository`, `LetterReactionRepository`
- **Service:** `PublicLetterService` (interface) → `PublicLetterServiceImpl`
- **Controller:** `PublicLetterController`

### 3.2 GET `/public-letters/:letterId`
**Components Required:**
- **Entity:** `Letter`, `PublicLetter`, `LetterReaction`
- **Response DTO:** `PublicLetterResponse`
- **Repository:** `PublicLetterRepository`, `LetterReactionRepository`
- **Service:** `PublicLetterService` (interface) → `PublicLetterServiceImpl`
- **Controller:** `PublicLetterController`

### 3.3 POST `/public-letters/:letterId/like`
**Components Required:**
- **Entity:** `Letter`, `LetterLike`
- **Response DTO:** `LikeResponse`
- **Repository:** `LetterLikeRepository`
- **Service:** `PublicLetterService` (interface) → `PublicLetterServiceImpl`
- **Controller:** `PublicLetterController`

### 3.4 POST `/public-letters/:letterId/save`
**Components Required:**
- **Entity:** `Letter`, `SavedLetter`
- **Response DTO:** `SaveResponse`
- **Repository:** `SavedLetterRepository`
- **Service:** `PublicLetterService` (interface) → `PublicLetterServiceImpl`
- **Controller:** `PublicLetterController`

### 3.5 POST `/public-letters/:letterId/reactions`
**Components Required:**
- **Entity:** `LetterReaction`
- **Request DTO:** `AddReactionRequest`
- **Response DTO:** `ReactionResponse`
- **Repository:** `LetterReactionRepository`
- **Service:** `PublicLetterService` (interface) → `PublicLetterServiceImpl`
- **Controller:** `PublicLetterController`

### 3.6 DELETE `/public-letters/:letterId/reactions/:reactionId`
**Components Required:**
- **Entity:** `LetterReaction`
- **Response DTO:** `MessageResponse`
- **Repository:** `LetterReactionRepository`
- **Service:** `PublicLetterService` (interface) → `PublicLetterServiceImpl`
- **Controller:** `PublicLetterController`

### 3.7 GET `/public-letters/saved`
**Components Required:**
- **Entity:** `SavedLetter`
- **Response DTO:** `PublicLetterListResponse`
- **Repository:** `SavedLetterRepository`
- **Service:** `PublicLetterService` (interface) → `PublicLetterServiceImpl`
- **Controller:** `PublicLetterController`

---

## 📮 4. Write Letter to Someone Else APIs

**Note:** This feature allows users to send letters to other people (via email or share publicly). All messages are subject to content moderation to ensure appropriate communication.

### 4.1 POST `/instant-letters`
**Description:** Send a letter to someone else (email recipient or public share)
**Components Required:**
- **Entity:** `InstantLetter`
- **Request DTO:** `SendInstantLetterRequest`
- **Response DTO:** `InstantLetterResponse`
- **Repository:** `InstantLetterRepository`
- **Service:** `InstantLetterService` (interface) → `InstantLetterServiceImpl`
- **Service:** `ContentModerationService` (interface) → `ContentModerationServiceImpl` (Required - checks for harmful content)
- **Service:** `LetterLimitService` (interface) → `LetterLimitServiceImpl`
- **Service:** `EmailService` (interface) → `EmailServiceImpl` (Required if sending via email)
- **Controller:** `InstantLetterController`

### 4.2 GET `/instant-letters`
**Description:** Get all letters sent to someone else (sent/received)
**Components Required:**
- **Entity:** `InstantLetter`
- **Response DTO:** `InstantLetterListResponse`, `InstantLetterResponse`
- **Repository:** `InstantLetterRepository`
- **Service:** `InstantLetterService` (interface) → `InstantLetterServiceImpl`
- **Controller:** `InstantLetterController`

---

## 💳 5. Subscriptions APIs

### 5.1 GET `/subscriptions`
**Components Required:**
- **Entity:** `Subscription`
- **Response DTO:** `SubscriptionResponse`
- **Repository:** `SubscriptionRepository`
- **Service:** `SubscriptionService` (interface) → `SubscriptionServiceImpl`
- **Controller:** `SubscriptionController`

### 5.2 POST `/subscriptions`
**Components Required:**
- **Entity:** `Subscription`
- **Request DTO:** `SubscribeRequest`
- **Response DTO:** `SubscribeResponse`
- **Repository:** `SubscriptionRepository`
- **Service:** `SubscriptionService` (interface) → `SubscriptionServiceImpl`
- **Service:** `PaymentService` (interface) → `PaymentServiceImpl` (Stripe integration)
- **Controller:** `SubscriptionController`

### 5.3 DELETE `/subscriptions`
**Components Required:**
- **Entity:** `Subscription`
- **Response DTO:** `CancelSubscriptionResponse`
- **Repository:** `SubscriptionRepository`
- **Service:** `SubscriptionService` (interface) → `SubscriptionServiceImpl`
- **Service:** `PaymentService` (interface) → `PaymentServiceImpl`
- **Controller:** `SubscriptionController`

### 5.4 GET `/subscriptions/plans`
**Components Required:**
- **Response DTO:** `SubscriptionPlansResponse`, `SubscriptionPlanResponse`
- **Service:** `SubscriptionService` (interface) → `SubscriptionServiceImpl`
- **Controller:** `SubscriptionController`

---

## 📊 6. Letter Limits & Usage APIs

### 6.1 GET `/letters/count`
**Components Required:**
- **Entity:** `Letter`
- **Response DTO:** `LetterCountResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterLimitService` (interface) → `LetterLimitServiceImpl`
- **Service:** `SubscriptionService` (interface) → `SubscriptionServiceImpl`
- **Controller:** `LetterController`

### 6.2 GET `/letters/can-create`
**Components Required:**
- **Entity:** `Letter`, `Subscription`
- **Response DTO:** `CanCreateLetterResponse`
- **Repository:** `LetterRepository`, `SubscriptionRepository`
- **Service:** `LetterLimitService` (interface) → `LetterLimitServiceImpl`
- **Service:** `SubscriptionService` (interface) → `SubscriptionServiceImpl`
- **Controller:** `LetterController`

---

## 🛡️ 7. Content Moderation APIs

### 7.1 POST `/moderation/check`
**Components Required:**
- **Request DTO:** `ModerationCheckRequest`
- **Response DTO:** `ModerationCheckResponse`, `ModerationWarning`
- **Service:** `ContentModerationService` (interface) → `ContentModerationServiceImpl`
- **Controller:** `ModerationController`

---

## ⚙️ 8. Internal/Background Jobs APIs

### 8.1 POST `/internal/letters/deliver`
**Components Required:**
- **Entity:** `Letter`
- **Response DTO:** `DeliveryJobResponse`
- **Repository:** `LetterRepository`
- **Service:** `LetterDeliveryService` (interface) → `LetterDeliveryServiceImpl`
- **Service:** `EmailService` (interface) → `EmailServiceImpl`
- **Controller:** `InternalController` (or Scheduled Job)

---

## 📋 Complete Component List

### **Entities (Database Models)**

1. `User`
   - Fields: `id`, `name`, `email`, `passwordHash`, `createdAt`, `updatedAt`, `emailVerified`, `googleId`

2. `Letter`
   - Fields: `id`, `userId`, `title`, `content`, `deliveryType`, `deliveryDate`, `openWhenTrigger`, `mood`, `identity`, `isPublic`, `status`, `isOpened`, `openedAt`, `createdAt`, `updatedAt`

3. `PublicLetter` (View/Projection of Letter)
   - Fields: `id`, `letterId`, `authorId`, `authorName`, `title`, `content`, `mood`, `identity`, `deliveryType`, `deliveryDate`, `openWhenTrigger`, `likesCount`, `createdAt`

4. `LetterReaction`
   - Fields: `id`, `letterId`, `userId`, `reaction`, `createdAt`

5. `LetterLike`
   - Fields: `id`, `letterId`, `userId`, `createdAt`

6. `SavedLetter`
   - Fields: `id`, `letterId`, `userId`, `createdAt`

7. `InstantLetter` (Write Letter to Someone Else)
   - Fields: `id`, `senderId`, `recipientEmail`, `recipientType` (email/public), `subject`, `message`, `isPublic`, `status`, `sentAt`, `createdAt`
   - **Note:** All messages must pass content moderation before being saved/sent

8. `Subscription`
   - Fields: `id`, `userId`, `plan`, `expiresAt`, `purchasedAt`, `cancelledAt`, `paymentMethodId`, `stripeSubscriptionId`, `isActive`

---

### **DTOs (Data Transfer Objects)**

#### **Request DTOs:**
1. `RegisterRequest`
2. `LoginRequest`
3. `GoogleLoginRequest`
4. `UpdateEmailRequest`
5. `ChangePasswordRequest`
6. `CreateDraftRequest`
7. `UpdateDraftRequest`
8. `ScheduleLetterRequest`
9. `SendInstantLetterRequest`
10. `SubscribeRequest`
11. `AddReactionRequest`
12. `ModerationCheckRequest`

#### **Response DTOs:**
1. `AuthResponse`
2. `UserResponse`
3. `MessageResponse`
4. `LetterResponse`
5. `LetterListResponse`
6. `ScheduleLetterResponse`
7. `OpenLetterResponse`
8. `PublicLetterResponse`
9. `PublicLetterListResponse`
10. `LikeResponse`
11. `SaveResponse`
12. `ReactionResponse`
13. `InstantLetterResponse`
14. `InstantLetterListResponse`
15. `SubscriptionResponse`
16. `SubscribeResponse`
17. `CancelSubscriptionResponse`
18. `SubscriptionPlansResponse`
19. `SubscriptionPlanResponse`
20. `LetterCountResponse`
21. `CanCreateLetterResponse`
22. `ModerationCheckResponse`
23. `ModerationWarning`
24. `DeliveryJobResponse`

---

### **Repositories (Data Access Layer)**

1. `UserRepository` extends `JpaRepository<User, String>`
2. `LetterRepository` extends `JpaRepository<Letter, String>`
3. `PublicLetterRepository` extends `JpaRepository<PublicLetter, String>`
4. `LetterReactionRepository` extends `JpaRepository<LetterReaction, String>`
5. `LetterLikeRepository` extends `JpaRepository<LetterLike, String>`
6. `SavedLetterRepository` extends `JpaRepository<SavedLetter, String>`
7. `InstantLetterRepository` extends `JpaRepository<InstantLetter, String>`
8. `SubscriptionRepository` extends `JpaRepository<Subscription, String>`

---

### **Services (Business Logic Layer)**

#### **Service Interfaces:**
1. `AuthService`
2. `UserService`
3. `OAuthService`
4. `LetterService`
5. `PublicLetterService`
6. `InstantLetterService`
7. `SubscriptionService`
8. `LetterLimitService`
9. `ContentModerationService`
10. `PaymentService`
11. `EmailService`
12. `LetterDeliveryService`

#### **Service Implementations:**
1. `AuthServiceImpl` implements `AuthService`
2. `UserServiceImpl` implements `UserService`
3. `OAuthServiceImpl` implements `OAuthService`
4. `LetterServiceImpl` implements `LetterService`
5. `PublicLetterServiceImpl` implements `PublicLetterService`
6. `InstantLetterServiceImpl` implements `InstantLetterService`
7. `SubscriptionServiceImpl` implements `SubscriptionService`
8. `LetterLimitServiceImpl` implements `LetterLimitService`
9. `ContentModerationServiceImpl` implements `ContentModerationService`
10. `PaymentServiceImpl` implements `PaymentService`
11. `EmailServiceImpl` implements `EmailService`
12. `LetterDeliveryServiceImpl` implements `LetterDeliveryService`

---

### **Controllers (REST API Endpoints)**

1. `AuthController`
   - Endpoints: `/auth/register`, `/auth/login`, `/auth/google`, `/auth/me`, `/auth/email`, `/auth/password`, `/auth/account`

2. `LetterController`
   - Endpoints: `/letters`, `/letters/:letterId`, `/letters/drafts`, `/letters/drafts/:draftId`, `/letters/schedule`, `/letters/:letterId/open`, `/letters/:letterId/opened`, `/letters/count`, `/letters/can-create`

3. `PublicLetterController`
   - Endpoints: `/public-letters`, `/public-letters/:letterId`, `/public-letters/:letterId/like`, `/public-letters/:letterId/save`, `/public-letters/:letterId/reactions`, `/public-letters/:letterId/reactions/:reactionId`, `/public-letters/saved`

4. `InstantLetterController` (Write Letter to Someone Else)
   - Endpoints: `/instant-letters` (POST - send letter), `/instant-letters` (GET - list sent/received letters)
   - **Note:** POST endpoint must call `ContentModerationService` before saving/sending

5. `SubscriptionController`
   - Endpoints: `/subscriptions`, `/subscriptions/plans`

6. `ModerationController`
   - Endpoints: `/moderation/check`

7. `InternalController` (or Scheduled Job)
   - Endpoints: `/internal/letters/deliver`

---

### **Additional Components**

#### **Exception Classes:**
1. `ResourceNotFoundException`
2. `ValidationException`
3. `UnauthorizedException`
4. `ForbiddenException`
5. `ConflictException`
6. `BadRequestException`
7. `InternalServerException`

#### **Configuration Classes:**
1. `SecurityConfig` (JWT, Authentication)
2. `CorsConfig`
3. `DatabaseConfig`
4. `EmailConfig`
5. `StripeConfig`
6. `RedisConfig` (if using caching)

#### **Utility Classes:**
1. `JwtUtil`
2. `PasswordUtil`
3. `DateUtil`
4. `EmailTemplateUtil`
5. `ContentModerationUtil`

---

## 🔄 Service Dependencies Map

```
AuthService
├── UserRepository
├── JwtUtil
└── PasswordUtil

UserService
├── UserRepository
└── PasswordUtil

LetterService
├── LetterRepository
├── SubscriptionService
└── LetterLimitService

PublicLetterService
├── PublicLetterRepository
├── LetterReactionRepository
├── LetterLikeRepository
└── SavedLetterRepository

InstantLetterService (Write Letter to Someone Else)
├── InstantLetterRepository
├── ContentModerationService (Required - validates message content)
├── LetterLimitService
└── EmailService (Required if sending via email)

SubscriptionService
├── SubscriptionRepository
└── PaymentService

LetterLimitService
├── LetterRepository
└── SubscriptionService

ContentModerationService
└── (External API or word list)

PaymentService
└── (Stripe SDK)

EmailService
└── (Email provider SDK)

LetterDeliveryService
├── LetterRepository
└── EmailService
```

---

## 📝 Notes

1. **Naming Convention:** Follow camelCase for Java/Kotlin, or PascalCase for TypeScript/NestJS
2. **Package Naming:** Use reverse domain notation (e.g., `com.futuroo.entity`)
3. **Repository Pattern:** Use Spring Data JPA repositories or TypeORM repositories
4. **Service Layer:** Always use interfaces for services to enable dependency injection and testing
5. **DTO Pattern:** Separate request/response DTOs from entities to prevent API exposure of internal structure
6. **Exception Handling:** Use global exception handler (`@ControllerAdvice`) for consistent error responses
7. **Validation:** Use `@Valid` annotations on request DTOs
8. **Security:** Implement JWT authentication middleware/interceptor
9. **Pagination:** Use `Pageable` interface for list endpoints
10. **Transactions:** Use `@Transactional` on service methods that modify data
11. **Content Moderation:** **CRITICAL** - All "Write Letter to Someone Else" messages MUST be validated through `ContentModerationService` before saving or sending. Reject messages containing threats, harmful language, or inappropriate content.
12. **Feature Naming:** The user-facing name is "Write Letter to Someone Else", but internal components may use "InstantLetter" naming for consistency with API endpoints.

---

## 🎯 Technology Stack Recommendations

### **Java/Spring Boot:**
- Spring Boot 3.x
- Spring Data JPA
- Spring Security (JWT)
- PostgreSQL Driver
- Stripe Java SDK
- SendGrid/Resend Java SDK

### **Node.js/NestJS:**
- NestJS 10.x
- TypeORM or Prisma
- Passport (JWT Strategy)
- PostgreSQL
- Stripe Node SDK
- Resend/SendGrid Node SDK

### **Python/FastAPI:**
- FastAPI
- SQLAlchemy
- PostgreSQL
- Stripe Python SDK
- SendGrid Python SDK

---

This architecture follows enterprise standards used by major tech companies and ensures scalability, maintainability, and testability.
