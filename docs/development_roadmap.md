# Project Daylight - Development Roadmap

*Last Updated: November 2024*

---

## Overview

This roadmap outlines the remaining development work for Project Daylight MVP, organized into 5 focused milestones that prioritize early functionality. Each milestone builds toward a launch-ready product that can start serving real users and generating revenue.

**Target Timeline:** 8-10 weeks to soft launch

---

## Milestone 0: Database Foundation (Week 1)
*"Set up the data layer for everything else to build on"*

### Database Schema & Infrastructure
- [ ] **Design and implement core database schema**
  - Events table (from voice_extraction_schema.md)
  - Evidence/documents table
  - Timeline entries linking events + evidence
  - User profiles and authentication structure
  - Audit trails for court credibility

- [ ] **Set up Supabase tables and relationships**
  - Row Level Security policies
  - Indexes for performance
  - Triggers for timestamps and audit logs
  
- [ ] **Create database migration system**
  - Initial schema migrations
  - Seed data for development
  - Migration documentation

### Estimated Time: 3-4 days

---

## Milestone 1: Real Data Capture & Storage (Week 1-2)
*"Make the capture features actually save data"*

### Core Capture Functionality
- [ ] **Connect voice capture to real storage**
  - Save audio files to Supabase storage
  - Store transcripts in database
  - Link extracted events to timeline
  - Store extraction metadata

- [ ] **Implement screenshot/photo capture**
  - Direct camera capture interface
  - Gallery upload functionality
  - Store images in Supabase storage
  - Basic OCR integration (Google Vision API or similar)
  - Extract text and save as evidence

- [ ] **File upload system**
  - Document upload interface
  - PDF, images, text files support
  - Store in Supabase storage
  - Extract metadata and searchable content

### Timeline Integration
- [ ] **Connect timeline to real data**
  - Display actual captured events
  - Real-time updates on new captures
  - Filter by date range and event type
  - Link timeline events to evidence

### Estimated Time: 5-6 days

---

## Milestone 2: Evidence Management & Export (Week 3-4)
*"Turn chaos into court-ready documentation"*

### Evidence Repository
- [ ] **Full evidence management**
  - Evidence preview system
  - Full-text search implementation
  - Evidence-to-event linking UI
  - Tagging and categorization
  - Evidence metadata display

- [ ] **Email forwarding integration**
  - Set up email ingestion endpoint
  - Parse emails and attachments
  - Auto-extract relevant information
  - Add to timeline automatically

### Export Functionality
- [ ] **PDF generation (Priority)**
  - Chronological timeline PDF
  - Include linked evidence
  - Court-appropriate formatting
  - Professional headers/footers
  - Page numbers and dates

- [ ] **Basic export templates**
  - Last 30 days report
  - Full timeline export
  - Incident-only report
  - Positive parenting summary

### Estimated Time: 6-7 days

---

## Milestone 3: AI Intelligence Layer (Week 5-6)
*"Add the smart features that differentiate us"*

### Natural Language Interpreter
- [ ] **Connect interpreter to real data**
  - Integrate with OpenAI/Anthropic API
  - Query against actual timeline/evidence
  - Return citations with responses
  - Save conversation history

- [ ] **Common query templates**
  - "What happened on [date]?"
  - "Show all incidents this month"
  - "Find patterns in [behavior]"
  - "Summarize custody compliance"

### Proactive Insights
- [ ] **Basic pattern detection**
  - Identify repeated incidents
  - Flag timeline gaps
  - Detect missing documentation
  - Surface contradictions

- [ ] **Smart notifications**
  - Pattern alerts
  - Documentation reminders
  - Deadline notifications
  - Evidence gap warnings

### Enhanced Extraction
- [ ] **Improve voice extraction**
  - Better temporal resolution
  - Multi-event extraction refinement
  - Confidence scoring
  - Ambiguity handling

### Estimated Time: 7-8 days

---

## Milestone 4: Landing Page & Polish (Week 7-8)
*"Get ready for real users"*

### Marketing Website
- [ ] **Landing page development**
  - Hero section with clear value prop
  - Feature highlights (3 core benefits)
  - Pricing section ($49-99/month)
  - Testimonials/use cases
  - CTA for free trial signup

- [ ] **Conversion optimization**
  - A/B test ready infrastructure
  - Analytics integration (Posthog/Mixpanel)
  - Email capture for waitlist
  - SEO optimization basics

### Product Polish
- [ ] **User onboarding flow**
  - Account creation streamlined
  - Initial data capture tutorial
  - Sample data for new users
  - First capture success moment

- [ ] **Critical bug fixes**
  - Performance optimization
  - Mobile responsiveness
  - Cross-browser testing
  - Error handling improvements

- [ ] **Advanced exports**
  - Word document generation
  - CSV data export
  - Custom date ranges
  - Email delivery option

### Estimated Time: 6-7 days

---

## Milestone 5: Launch Preparation (Week 9-10)
*"Go live with paying customers"*

### Payment & Subscriptions
- [ ] **Stripe integration**
  - Subscription management
  - 7-day free trial
  - Payment processing
  - Billing portal

- [ ] **Account management**
  - User settings/profile
  - Data export/portability
  - Account deletion
  - Privacy controls

### Production Readiness
- [ ] **Infrastructure hardening**
  - Error monitoring (Sentry)
  - Performance monitoring
  - Backup systems
  - Security audit

- [ ] **Legal/Compliance**
  - Terms of Service
  - Privacy Policy
  - Data handling documentation
  - HIPAA compliance basics

### Go-to-Market
- [ ] **Soft launch preparation**
  - Beta user recruitment (10-20 users)
  - Support documentation
  - Feedback collection system
  - Initial marketing materials

### Estimated Time: 7-8 days

---

## Development Principles

### Priority Order
1. **Make it work** - Functional before beautiful
2. **Make it valuable** - Features users will pay for
3. **Make it scalable** - But not over-engineered

### Technical Decisions
- **Database:** Supabase (already configured)
- **File Storage:** Supabase Storage
- **AI/LLM:** OpenAI API (already integrated)
- **OCR:** Google Vision API or Tesseract
- **PDF Generation:** Puppeteer or jsPDF
- **Payments:** Stripe
- **Analytics:** PostHog or Mixpanel
- **Email:** SendGrid or Resend

### Quality Gates
Each milestone should meet these criteria before moving forward:
- Core functionality works end-to-end
- No critical bugs
- Mobile responsive
- Basic error handling
- Can demo to potential user

---

## Success Metrics

### Milestone 1 Success
- Voice note → saved event in timeline
- Photo upload → extracted text in evidence

### Milestone 2 Success  
- Generate real PDF from actual data
- Search and find specific evidence

### Milestone 3 Success
- Ask "What happened yesterday?" → get real answer
- System identifies a pattern in actual data

### Milestone 4 Success
- Landing page converts visitor to trial signup
- New user successfully captures first event

### Milestone 5 Success
- First paying customer
- 10+ active trial users

---

## Risk Mitigation

### Technical Risks
- **OCR accuracy:** Start with Google Vision API for reliability
- **PDF generation complexity:** Use existing templates, iterate later
- **AI costs:** Implement usage caps and monitoring

### Market Risks
- **User adoption:** Focus on Richmond family court community first
- **Pricing sensitivity:** A/B test pricing, offer emergency packages
- **Competition:** Move fast, focus on integration not features

---

## Post-MVP Enhancements

After successful launch and initial revenue:
- Calendar integration
- Voice speaker identification  
- Multi-language support
- Attorney collaboration features
- Court filing integration
- Mobile native apps

---

## Next Immediate Steps

### This Week (Week 1)
1. Complete database schema implementation
2. Connect voice capture to real storage
3. Implement basic photo upload with OCR
4. Make timeline display real data

### Quick Wins for Momentum
- Get one complete flow working: Voice → Event → Timeline → PDF
- Deploy to staging for testing
- Recruit 3-5 alpha testers

---

*Remember: The goal is paying customers in 10 weeks, not perfection. Ship early, iterate based on real user feedback.*
