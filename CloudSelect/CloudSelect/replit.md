# CloudMatch - Cloud Provider Recommendation Platform

## Overview

CloudMatch is a comprehensive web application designed to help users find the perfect cloud platform for their specific needs. The platform provides intelligent matching between user requirements and cloud providers, featuring real-time pricing calculations, personalized recommendations, and step-by-step setup guides. Users complete a detailed questionnaire about their project type, budget, region preferences, and technical requirements, and receive ranked recommendations from 10+ global cloud providers with detailed cost estimates and setup complexity assessments.

## Recent Changes (January 2025)
- ✅ Expanded cloud provider database to include 10+ providers (AWS, Google Cloud, Azure, DigitalOcean, Linode, IBM Cloud, Oracle Cloud, Alibaba Cloud, Hetzner Cloud, OVHcloud, Vultr)
- ✅ Enhanced recommendation algorithm with regional preferences and cost optimization
- ✅ Added comprehensive setup guides for major providers
- ✅ Improved scoring algorithm for better provider matching
- ✅ Fixed JSX compilation issues and routing problems
- ✅ Added HTML validation fixes for better accessibility
- ✅ **NEW**: Interactive provider comparison charts with side-by-side feature analysis
- ✅ **NEW**: Email results functionality with backend API endpoint
- ✅ **NEW**: Smooth animations and transitions throughout the application
- ✅ **NEW**: Enhanced user experience with action buttons and interactive elements

## User Preferences

Preferred communication style: Simple, everyday language.

## User Feedback
- User expressed high satisfaction with CloudMatch: "this was amazing" (January 2025)
- Positive feedback on expanded provider database and recommendation system
- Confirmed satisfaction with advanced features implementation: "yes" (January 2025)
- Requested removal of voice input feature: "can u remove voice input" (January 2025)

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **UI Components**: Comprehensive component library built on Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture with dedicated endpoints for providers, assessments, and recommendations
- **Data Storage**: In-memory storage implementation with interface-based design for easy database migration
- **Request Processing**: Custom middleware for logging and error handling

### Data Storage Solutions
- **Current**: In-memory storage using Map data structures for development
- **Database ORM**: Drizzle ORM configured for PostgreSQL with migration support
- **Schema Management**: Shared type definitions using Zod schemas for validation
- **Future-Ready**: Database configuration ready for PostgreSQL deployment with Neon Database serverless integration

### Authentication and Authorization
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Security**: Basic session-based authentication structure prepared for implementation

### External Dependencies
- **Database**: Neon Database serverless PostgreSQL integration ready
- **Styling**: Font Awesome icons for provider logos and UI elements
- **Development**: Replit-specific plugins for cartographer and runtime error handling
- **Build Tools**: ESBuild for production bundling and TSX for development server

The architecture follows a monorepo structure with shared types and schemas, enabling type safety across the full stack. The modular design allows for easy extension of cloud providers and recommendation algorithms while maintaining clean separation between frontend presentation, backend logic, and data persistence layers.