# A Practical Guide to Spec-Driven Development

**Source:** https://docs.zencoder.ai/user-guides/tutorials/spec-driven-development-guide
**Publisher:** Zencoder Docs

---

Spec-Driven Development (SDD) is a methodology where you write complete requirements and technical specifications before passing them to an AI coding agent, rather than iterating through conversational prompts. This guide walks through a real-world example — building a notification system — to show how SDD compares to traditional prompting.

---

## The Evolution: From Vibe-Coding to Systematic Development

### The Problem with Traditional Prompting

When AI coding agents first emerged, we treated them like search engines – type a query, get code back. This "vibe-coding" approach works great for quick prototypes, but it breaks down when building serious, mission-critical applications. Consider this typical interaction:

**Round 1:**
```
Human: Add a notification system to my app
AI: Here's a basic notification component with toast messages...
```

**Round 2:**
```
Human: No, I need backend notifications for order updates
AI: Here's a simple email notification service...
```

**Round 3:**
```
Human: It needs to support SMS too, and users should control preferences
AI: Let me add an SMS provider and a preferences model...
```

**Round 4:**
```
Human: What about retry logic? And we need delivery tracking
AI: Adding exponential backoff and a delivery status table...
```

And so it continues…

Each iteration loses context from previous discussions. The agent makes reasonable assumptions that turn out wrong. You spend more time correcting course than building features.

### Enter Spec-Driven Development

Spec-driven development flips this model. Instead of iterative discovery, you provide comprehensive specifications upfront. Your AI agent receives a complete picture of what to build, why it matters, and critically — what NOT to build.

| Traditional Prompting | Spec-Driven Development |
|---|---|
| Iterative discovery | Upfront clarity |
| Multiple corrections needed | Single source of truth |
| Context loss over time | Persistent context |
| Generic implementations | Tailored implementations |
| Unpredictable results | Predictable outcomes |

### Why SDD Works in Production Environments

In established codebases, simple prompting often produces code that technically works but doesn't fit. The AI might choose different state management than your existing patterns, recreate functionality that already exists, or miss compliance requirements that aren't explicitly stated.

Spec-driven development addresses this by front-loading context. Your specification becomes the complete picture — not just what to build, but how it should integrate with existing systems, what patterns to follow, and what constraints to respect. This is especially critical in brownfield environments where implicit knowledge matters as much as explicit requirements.

---

## The Four Phases of Spec-Driven Development

1. **Specify** — Define what you're building from the user's perspective, including success criteria and constraints
2. **Plan** — Create a technical architecture that respects your existing codebase and constraints
3. **Tasks** — Break down the implementation into discrete, testable units of work
4. **Implement** — Execute against the plan with continuous validation against specifications

Let's walk through each phase using a real example: building a production-ready notification system for an e-commerce platform.

---

## Our Example: Real-Time Notification System

Throughout this guide, we'll build a notification system with these requirements:
- Multi-channel delivery (email, SMS, in-app)
- User preference management
- Retry logic with exponential backoff
- Delivery tracking and analytics
- Real-time updates

---

## Phase 1: Specify – Creating Your North Star

The specification is your contract with the AI agent. It defines success in user terms, not technical jargon.

### Generating Your Specification

Start by asking your AI agent:

```
Create a comprehensive specification for [feature name] that includes:
- User story and stakeholders
- Measurable success criteria
- Functional and non-functional requirements
- Explicit constraints (what NOT to build)
- Technical context and integration points
- Acceptance tests

Be specific enough that another developer could implement without clarification.
```

### Traditional Approach

```
"Build a notification system for order updates"
```

This seems clear to you because you have context. But the AI agent must guess at dozens of implicit requirements.

### Spec-Driven Approach

```markdown
# Order Notification System Specification

## User Story
As a customer, I want to receive timely updates about my order status through my preferred
communication channels, so I can stay informed without constantly checking the website.

## Stakeholders
- **Primary**: E-commerce customers (50K daily active users)
- **Secondary**: Customer service team (reduce support tickets by 40%)
- **Tertiary**: Operations team (monitor delivery performance)

## Success Criteria
1. **Delivery Speed**: 95% of notifications delivered within 60 seconds
2. **Reliability**: 99.9% successful delivery rate (after retries)
3. **Preference Compliance**: 100% adherence to user channel preferences
4. **Support Impact**: 40% reduction in "where's my order" tickets

## Functional Requirements

### Multi-Channel Support
- Email notifications via SendGrid
- SMS notifications via Twilio
- In-app notifications via WebSocket
- Each channel independently toggleable

### Notification Types
1. Order confirmed
2. Payment processed
3. Order shipped (with tracking)
4. Out for delivery
5. Delivered
6. Delivery failed
7. Refund initiated
8. Refund completed

### User Preferences
- Global on/off switch
- Per-channel toggles
- Per-notification-type preferences
- Quiet hours (no SMS between 10 PM - 8 AM)
- Language preference (English, Spanish, French)

### Retry Logic
- 3 retry attempts for failed deliveries
- Exponential backoff: 1 min, 5 min, 15 min
- Different strategies per channel
- Dead letter queue after final failure

### Analytics Requirements
- Track delivery rate per channel
- Track open/click rates for email
- Track user preference changes
- Monitor retry patterns
- Alert on delivery degradation

## Non-Functional Requirements

### Performance
- Handle 10,000 concurrent notifications
- 60-second end-to-end delivery SLA
- No more than 100ms API response time

### Security
- PII data encryption at rest
- Secure token generation for unsubscribe links
- Rate limiting per user (max 50 notifications/day)

### Compliance
- CAN-SPAM compliant unsubscribe mechanism
- TCPA compliance for SMS
- GDPR-compliant data handling

## Explicit Constraints (DO NOT)
- Do NOT implement push notifications (Phase 2)
- Do NOT build a custom email service (use SendGrid)
- Do NOT modify the existing User model
- Do NOT add social media notifications
- Do NOT implement notification templates editing UI (admins will use code)
- Do NOT create a separate notification service (embed in monolith)

## Technical Context
- Existing stack: Next.js 14, PostgreSQL, Redis
- Must integrate with existing OrderService
- Must use existing authentication system
- Must respect current API versioning (v2)

## Acceptance Tests
1. User can enable/disable individual channels
2. Notification arrives within 60 seconds of trigger
3. Failed notifications retry with correct backoff
4. Quiet hours are respected for SMS
5. Unsubscribe link works without authentication
6. Analytics dashboard shows real-time metrics
```

This specification succeeds because it:
1. **Starts with users**: Who needs this and why?
2. **Defines measurable success**: Concrete metrics, not vague goals
3. **Lists explicit constraints**: What NOT to build is as important
4. **Provides context**: Existing systems and limitations
5. **Includes acceptance criteria**: Clear validation requirements

> **Pro Tip**: Your specification should be detailed enough that another developer could implement it without asking clarifying questions. If you find yourself explaining things during implementation, add those clarifications to the spec for next time.

---

## Phase 2: Plan – From Vision to Architecture

With a clear specification, your AI agent can create a comprehensive technical plan that considers your entire ecosystem.

### Setting Up the Planning Phase

In Zencoder, leverage the Coding Agent with Repo Info Agent to understand your existing codebase:

```
Based on the specification above, create a technical implementation plan.
Consider our existing services and patterns.
Identify integration points and potential conflicts.
```

### The Generated Plan

**Database Schema:**

```sql
-- Notification Preferences Table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  channel_email BOOLEAN DEFAULT true,
  channel_sms BOOLEAN DEFAULT false,
  channel_in_app BOOLEAN DEFAULT true,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  language VARCHAR(10) DEFAULT 'en',
  global_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Notification Type Preferences
CREATE TABLE notification_type_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  notification_type VARCHAR(50) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  channels JSONB DEFAULT '["email", "in_app"]'::jsonb,
  UNIQUE(user_id, notification_type)
);

-- Notification Log
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'pending', 'sent', 'delivered', 'failed'
  retry_count INTEGER DEFAULT 0,
  payload JSONB NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_notification_log_user_id ON notification_log(user_id);
CREATE INDEX idx_notification_log_status ON notification_log(status);
CREATE INDEX idx_notification_log_created_at ON notification_log(created_at);
```

**API Design:**

```typescript
// API Endpoints
interface NotificationAPI {
  // Preference Management
  'GET /api/v2/notifications/preferences': UserPreferences;
  'PUT /api/v2/notifications/preferences': UpdatedPreferences;
  'POST /api/v2/notifications/unsubscribe/:token': UnsubscribeResult;

  // Analytics (Internal)
  'GET /api/v2/notifications/analytics': AnalyticsDashboard;
  'GET /api/v2/notifications/analytics/delivery-rate': DeliveryMetrics;

  // WebSocket
  'WS /api/v2/notifications/stream': NotificationStream;
}

// Internal Service Interface
interface NotificationService {
  trigger(event: NotificationEvent): Promise<void>;
  retry(notificationId: string): Promise<void>;
  getDeliveryStatus(notificationId: string): DeliveryStatus;
}
```

Notice how the plan respects the constraints: no push notifications, uses existing services, maintains API versioning.

---

## Phase 3: Tasks – Breaking Down the Mountain

With architecture defined, we decompose the implementation into manageable, testable chunks.

### Generating the Task List

```
Break down the implementation into discrete tasks.
Each task should be:
- Independently implementable
- Testable in isolation
- Reviewable as a single PR
```

### The Task Breakdown

**Database Setup**
- Create migration for notification_preferences table
- Create migration for notification_type_preferences table
- Create migration for notification_log table
- Add indexes and constraints
- Seed with test data

**Core Models**
- Implement NotificationPreference model
- Implement NotificationTypePreference model
- Implement NotificationLog model
- Add Zod schemas for validation
- Create TypeScript types

**Preference Manager**
- Build PreferenceManager service
- Implement preference cascade logic
- Add quiet hours checking
- Create preference caching layer
- Write preference API endpoints

**Provider Implementations**
- Create abstract NotificationProvider class
- Implement EmailProvider with SendGrid
- Implement SMSProvider with Twilio
- Implement WebSocketProvider
- Add provider health checks

**Queue System**
- Set up Redis queue structure
- Implement NotificationQueue class
- Build QueueProcessor with retry logic
- Add exponential backoff
- Create dead letter queue handler

**Integration Layer**
- Hook into OrderService events
- Create notification triggers
- Map order events to notification types
- Add event validation

**Analytics & Monitoring**
- Build analytics aggregation service
- Create delivery rate calculations
- Implement real-time metrics
- Add performance monitoring
- Set up alerting thresholds

**Testing Suite**
- Unit tests for each provider
- Integration tests for queue system
- E2E tests for notification flow
- Load tests for 10K concurrent notifications
- Compliance validation tests

Each test validates against specification acceptance criteria. This creates automatic guardrails — if the implementation deviates from requirements, tests fail. Test-driven development keeps the agent aligned with specifications throughout implementation.

> **Using Zencoder**: Each task becomes a conversation with your Coding Agent. The agent maintains context across tasks through the specification and plan, ensuring consistency.

---

## Phase 4: Implement – Guided Execution with Validation

Now we implement each task, with the AI agent having full context of specifications, architecture, and dependencies. With specifications defining requirements, tests providing guardrails, and a technical plan establishing architecture, Phase 4 implementation becomes significantly more autonomous. The agent can execute with confidence while you shift attention to planning the next feature. Verification catches deviations automatically, eliminating the need for constant supervision.

### Traditional vs. Spec-Driven Implementation

Let's implement the EmailProvider to see the difference.

**Traditional Prompt:**
```
Human: Implement an email notification provider
```

The agent might generate:
```typescript
class EmailProvider {
  async send(to: string, subject: string, body: string) {
    // Generic implementation
    await sendEmail(to, subject, body);
  }
}
```

This is technically correct but misses:
- Error handling strategy
- Retry logic integration
- Analytics tracking
- Template system
- Unsubscribe links
- Compliance requirements

**Spec-Driven Implementation** (with full context, the agent generates):

```typescript
import { NotificationProvider, DeliveryResult, NotificationPayload } from '@/lib/notifications/types';
import { sendGridClient } from '@/lib/email/client';
import { generateUnsubscribeToken } from '@/lib/auth/tokens';
import { trackEmailEvent } from '@/lib/analytics';
import { NotificationLog } from '@/models/notification-log';
import { templates } from '@/lib/notifications/templates';

export class EmailProvider extends NotificationProvider {
  readonly channel = 'email' as const;
  readonly maxRetries = 3;
  readonly retryDelays = [60000, 300000, 900000]; // 1min, 5min, 15min

  async validate(payload: NotificationPayload): Promise<boolean> {
    // Validate email address format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.recipient.email)) {
      throw new Error(`Invalid email address: ${payload.recipient.email}`);
    }

    // Check for required template
    if (!templates[payload.type]) {
      throw new Error(`No template found for notification type: ${payload.type}`);
    }

    // Validate payload has required fields for template
    const template = templates[payload.type];
    const missingFields = template.requiredFields.filter(
      field => !payload.data[field]
    );
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
  }

  async send(
    payload: NotificationPayload,
    attemptNumber: number = 1
  ): Promise<DeliveryResult> {
    const startTime = Date.now();

    try {
      // Validate before sending
      await this.validate(payload);

      // Generate unsubscribe token (CAN-SPAM compliance)
      const unsubscribeToken = await generateUnsubscribeToken(
        payload.recipient.id,
        'email'
      );

      // Prepare email content
      const template = templates[payload.type];
      const html = await template.render({
        ...payload.data,
        unsubscribeUrl: `${process.env.APP_URL}/unsubscribe/${unsubscribeToken}`,
        userName: payload.recipient.name,
        language: payload.recipient.language || 'en'
      });

      // Add tracking pixel for analytics
      const trackingPixel = `<img src="${process.env.APP_URL}/api/v2/track/email/${payload.id}" width="1" height="1" />`;
      const htmlWithTracking = html.replace('</body>', `${trackingPixel}</body>`);

      // Send via SendGrid
      const response = await sendGridClient.send({
        to: payload.recipient.email,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL!,
          name: 'YourStore Notifications'
        },
        subject: template.subject(payload.data),
        html: htmlWithTracking,
        text: template.text(payload.data), // Fallback plain text
        categories: [payload.type, `attempt-${attemptNumber}`],
        customArgs: {
          userId: payload.recipient.id,
          notificationId: payload.id,
          type: payload.type
        },
        mailSettings: {
          sandboxMode: {
            enable: process.env.NODE_ENV === 'test'
          }
        },
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true }
        }
      });

      // Track successful send
      await trackEmailEvent({
        event: 'sent',
        notificationId: payload.id,
        userId: payload.recipient.id,
        type: payload.type,
        latency: Date.now() - startTime
      });

      // Update notification log
      await NotificationLog.update(payload.id, {
        status: 'sent',
        sentAt: new Date(),
        attemptNumber,
        providerResponse: response.messageId
      });

      return {
        success: true,
        messageId: response.messageId,
        channel: 'email',
        deliveredAt: new Date(),
        attemptNumber
      };

    } catch (error) {
      // Detailed error tracking
      await trackEmailEvent({
        event: 'failed',
        notificationId: payload.id,
        userId: payload.recipient.id,
        type: payload.type,
        error: error.message,
        attemptNumber,
        latency: Date.now() - startTime
      });

      // Determine if error is retryable
      const retryable = this.isRetryableError(error);

      // Update notification log with failure
      await NotificationLog.update(payload.id, {
        status: retryable && attemptNumber < this.maxRetries ? 'pending' : 'failed',
        errorMessage: error.message,
        attemptNumber,
        nextRetryAt: retryable ? new Date(Date.now() + this.retryDelays[attemptNumber - 1]) : null
      });

      return {
        success: false,
        error: error.message,
        retryable,
        channel: 'email',
        attemptNumber
      };
    }
  }

  private isRetryableError(error: any): boolean {
    // Network errors are retryable
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return true;
    }

    // SendGrid rate limiting is retryable
    if (error.response?.statusCode === 429) {
      return true;
    }

    // SendGrid service errors are retryable
    if (error.response?.statusCode >= 500) {
      return true;
    }

    // Invalid recipient, template errors are not retryable
    if (error.response?.statusCode >= 400 && error.response?.statusCode < 500) {
      return false;
    }

    // Default to retryable for unknown errors
    return true;
  }

  async checkHealth(): Promise<boolean> {
    try {
      // Verify SendGrid API key is valid
      await sendGridClient.request({
        method: 'GET',
        url: '/v3/scopes'
      });
      return true;
    } catch {
      return false;
    }
  }
}
```

The spec-driven implementation includes everything from the specification:
- Compliance features (unsubscribe links, CAN-SPAM)
- Analytics tracking
- Retry logic coordination
- Error classification
- Template system
- Health monitoring

### Verification: The Industrial-Grade Safety Net

Specifications without verification are just documentation. The power of spec-driven development comes from continuous validation.

**Test-Driven Guardrails**: Each acceptance criterion in your specification becomes a test case. As the agent implements:
1. Tests validate correctness against spec requirements
2. Failures indicate deviation from specifications
3. Success confirms alignment with intended behavior

This verification layer transforms AI coding from "hope it works" to "prove it works."

**Example from the notification system:**

```typescript
// Specification says: "95% of notifications delivered within 60 seconds"
describe('EmailProvider delivery speed', () => {
  it('delivers within 60 seconds at 95th percentile', async () => {
    const deliveryTimes = await measureDeliveryTimes(1000);
    const p95 = percentile(deliveryTimes, 95);
    expect(p95).toBeLessThan(60000); // 60 seconds
  });
});

// Specification says: "Respect quiet hours for SMS"
describe('SMSProvider quiet hours', () => {
  it('queues SMS during quiet hours', async () => {
    setTime('23:00'); // 11 PM
    await notificationService.trigger(smsNotification);
    expect(immediatelySent).toBe(false);
    expect(queuedFor).toBe('08:00');
  });
});
```

Without these guardrails, the agent might implement retry logic that "looks right" but uses the wrong intervals, or add quiet hours that check the wrong timezone.

---

## Implementing in Zencoder: Practical Workflow

### Step 1: Organize Your Specifications

Create a dedicated structure for your specifications:

```
project-root/
├── .zencoder/
│   ├── specs/           # Your specifications
│   │   ├── notifications.md
│   │   ├── authentication.md
│   │   └── payment-processing.md
│   ├── plans/           # Technical plans
│   │   └── notifications-plan.md
│   └── rules/           # Zen Rules for consistency
│       └── sdd-standards.md
```

### Step 2: Configure Zen Rules for SDD

Create a Zen Rules file to enforce spec-driven patterns:

```markdown
---
description: "Spec-driven development standards"
alwaysApply: true
---

# Spec-Driven Development Standards

## Before Implementation
1. Always check for an existing specification in `.zencoder/specs/`
2. If no spec exists, request one before proceeding
3. Validate implementation plans against specifications

## During Implementation
1. Each file should reference its governing specification
2. Use specification acceptance criteria as test cases
3. Flag any deviations from spec as "SPEC_DEVIATION: [reason]"

## Validation Checklist
- [ ] Implementation matches specification requirements
- [ ] All explicit constraints (DO NOTs) are respected
- [ ] Acceptance criteria have corresponding tests
- [ ] Performance requirements are validated
- [ ] Security requirements are implemented
```

### Step 3: Initialize Your Agent Workflow

**1. Generate Project Context** — Use the Repo Info Agent to create comprehensive project context:

```
/repo-info
Generate a comprehensive analysis including architecture patterns,
dependencies, and coding conventions
```

**2. Start with Specification** — Open the Coding Agent and provide your specification:

```
Here's the specification for our notification system:
[paste specification]

Please review and identify any clarifications needed before we proceed.
```

**3. Generate the Plan:**

```
Based on the specification and our codebase analysis, create a
technical implementation plan including architecture, database
schema, and integration points.
```

**4. Create Task List:**

```
Break down the implementation into discrete, testable tasks.
Each task should be a single PR worth of work.
Include time estimates and dependencies.
```

**5. Implement Tasks** — For each task:

```
Implement [Task Name] according to the specification and plan.
Reference: `.zencoder/specs/notifications.md` section [X]
Acceptance criteria: [list from spec]
```

### Step 4: Leverage Multi-Agent Collaboration

**Unit Testing Agent** — Generate tests directly from specifications:

```
Generate unit tests for EmailProvider based on these acceptance criteria:
- Notifications delivered within 60 seconds
- Failed sends retry with exponential backoff
- Unsubscribe links included in all emails
```

**E2E Testing Agent** — Validate complete user flows:

```
Create E2E tests for the notification preference flow:
1. User disables SMS notifications
2. Order status changes
3. Verify only email and in-app notifications sent
```

---

## Working Across Multiple Sessions

Spec-driven development truly shines in long-running tasks that span multiple coding sessions.

### State Management Strategy

**Progress Tracking** — Create a `progress.md` file that your agent updates:

```markdown
# Notification System Implementation Progress

## Completed Tasks
- [x] Database migrations (PR #234)
- [x] Core models (PR #235)
- [x] PreferenceManager service (PR #236)
- [x] EmailProvider implementation (PR #237)

## Current Task
- [ ] SMSProvider implementation
  - Twilio client configured
  - Basic send method complete
  - TODO: Add retry logic
  - TODO: Add quiet hours check

## Upcoming Tasks
- [ ] WebSocketProvider
- [ ] Queue processor
- [ ] Analytics dashboard

## Blockers
- Waiting for Twilio API credentials from DevOps

## Notes for Next Session
- SMS provider needs special handling for international numbers
- Consider adding provider circuit breaker pattern
- Performance test results: current implementation handles 5K/sec
```

**Test Status Tracking** — Maintain a `test-status.json` for systematic validation:

```json
{
  "specVersion": "1.2.0",
  "lastUpdated": "2024-01-15T10:30:00Z",
  "acceptanceCriteria": {
    "delivery_speed": {
      "requirement": "95% within 60 seconds",
      "status": "passing",
      "metrics": {
        "p95": 45.3,
        "p99": 58.2
      }
    },
    "retry_logic": {
      "requirement": "3 retries with exponential backoff",
      "status": "passing",
      "tests": [
        "email_retry_test.ts",
        "sms_retry_test.ts"
      ]
    },
    "quiet_hours": {
      "requirement": "No SMS between 10 PM - 8 AM",
      "status": "in_progress",
      "notes": "Timezone handling needs work"
    },
    "unsubscribe": {
      "requirement": "One-click unsubscribe without auth",
      "status": "passing",
      "compliance": "CAN-SPAM verified"
    }
  }
}
```

### Better Code Review Through Structure

Spec-driven development fundamentally improves code review. Instead of reviewing scattered changes across multiple files and reverse-engineering the developer's intent, reviewers follow a clear path:

**Traditional AI-Generated PR:**
- 10 files changed across different concerns
- Unclear which changes address which requirements
- Reviewer must mentally reconstruct the feature
- Easy to miss edge cases or requirement deviations

**Spec-Driven PR:**
- Each PR maps to a specific task from the breakdown
- Task links to relevant specification section
- Reviewer validates: "Does this implementation satisfy the spec requirements?"
- Tests prove acceptance criteria are met

This top-down review process — specification → plan → task → implementation — keeps humans meaningfully in the loop while AI handles execution.

> **Model Selection Matters**: Different AI models have different strengths. For example, Claude Sonnet 4.5 excels at state management and maintaining context across long sessions. Experiment with different models for different phases of development.

### Resuming Work

When starting a new session:

```
Review the progress in progress.md and test-status.json.
Check git log for recent changes.
Continue with the current task, maintaining consistency with completed work.
```

> **Pro Tip**: Commit your progress file and test status with each PR. This creates a historical record of implementation decisions and helps onboard team members quickly.

---

## When to Use Each Approach

Not every coding task needs full specification. Here's the decision framework:

**Use Traditional Prompting — Perfect for:**
- Quick prototypes and experiments
- Simple utility functions
- Bug fixes with clear solutions
- Learning and exploration
- One-off scripts
- Small UI tweaks

Example tasks:
- "Fix the sorting bug in the user table"
- "Add a loading spinner to the form"
- "Create a script to clean up old logs"

**Use Spec-Driven Development — Essential for:**
- Production features
- Multi-file implementations
- Integration with existing systems
- Features with compliance requirements
- Long-running development tasks
- Team projects requiring consistency

Example tasks:
- "Build a notification system"
- "Implement payment processing"
- "Create a data synchronization service"

---

## Patterns for Success

### Pattern 1: Living Specifications

Your specifications should evolve with your understanding:

```markdown
# Specification Version History

## v1.2.0 (Current)
- Added requirement for SMS quiet hours
- Clarified retry backoff intervals
- Added language preference support

## v1.1.0
- Added analytics requirements
- Specified performance targets

## v1.0.0
- Initial specification
```

### Pattern 2: Specification Templates

Create templates for common features:

**API Feature Template:**
```markdown
# [Feature Name] API Specification

## Endpoints
- Method, path, description
- Request/response schemas
- Error codes

## Authentication
- Required permissions
- Rate limiting

## Performance Requirements
- Response time targets
- Throughput requirements

## Security Considerations
- Data validation
- Audit logging
```

**Background Job Template:**
```markdown
# [Job Name] Background Job Specification

## Trigger Conditions
- Schedule or events

## Processing Logic
- Step-by-step algorithm
- Error handling

## Idempotency
- How to handle retries

## Monitoring
- Success/failure metrics
- Alerting thresholds
```

### Pattern 3: Test-Driven Specifications

Include test scenarios in your specifications:

```markdown
## Test Scenarios

### Happy Path
Given: User has all channels enabled
When: Order status changes to "shipped"
Then: Email, SMS, and in-app notifications sent within 60 seconds

### Edge Case: Quiet Hours
Given: Current time is 11 PM, user has SMS enabled
When: Order delivered notification triggered
Then: Email and in-app sent immediately, SMS queued for 8 AM

### Error Case: Provider Failure
Given: SendGrid API returns 500 error
When: Email notification attempted
Then: Retry after 1 minute, then 5 minutes, then 15 minutes
```

---

## Anti-Patterns to Avoid

- **Over-Specifying Implementation Details**: Specify what, not how
- **Under-Specifying Edge Cases**: Think through error scenarios
- **Ignoring Existing Patterns**: Respect your codebase conventions
- **Skipping the Planning Phase**: Architecture matters
- **Not Updating Specs**: Keep them living documents

---

## Establishing Reproducible Development Processes

One challenge with AI-assisted development is the wide variation in individual developers' prompting skills and AI experience. A senior developer who knows how to prompt effectively might achieve 3x productivity, while a junior developer struggles with the same tools.

Spec-driven development creates a standardized process that works regardless of individual AI expertise. The methodology is embedded in the specifications and workflow, not dependent on each developer's ability to craft the perfect prompt. This democratizes AI productivity across your organization:

- Junior developers follow the same spec → plan → tasks → implement flow as senior developers
- Code quality remains consistent because requirements and verification are explicit
- Knowledge lives in specifications and tests, not in individuals' prompting techniques
- Teams can scale AI-assisted development without scaling AI expertise

The result is a unified approach to development that produces predictable, high-quality outcomes across your entire engineering organization.

---

## Getting Started: Your First Spec-Driven Feature

Ready to try spec-driven development? Start with a small, self-contained feature:

**1. Choose a Feature** — Pick something with:
- Clear user value
- 3-5 day implementation
- Minimal external dependencies
- Defined success criteria

**2. Write Your First Specification** — Use this minimal template:

```markdown
# [Feature] Specification

## User Story
As a [user type], I want [capability], so that [benefit]

## Success Criteria
1. [Measurable outcome]
2. [Measurable outcome]

## Requirements
- [Functional requirement]
- [Functional requirement]

## Constraints
- Do NOT [constraint]
- Must use [existing system]
```

**3. Generate Plan with AI Agent:**

```
Create a technical plan for this specification.
Consider our existing codebase and patterns.
```

**4. Implement and Iterate** — Work through tasks systematically, updating your specification as you learn.

---

## Looking Forward

Spec-driven development isn't just about writing better prompts — it's about fundamentally changing how we collaborate with AI coding agents. By treating them as highly capable but literal-minded partners who excel with clear direction, we unlock their true potential.

The examples in this guide demonstrate that the additional upfront investment in specifications pays dividends throughout implementation:
- Fewer iterations and corrections
- Better alignment with requirements
- More maintainable code
- Comprehensive test coverage
- Living documentation

As AI agents become more sophisticated, the ability to precisely specify what we want becomes even more valuable. The agents gain capabilities, but they still need clear direction to apply those capabilities effectively.

**Remember**: Spec-driven development and traditional prompting aren't mutually exclusive. Use the right tool for the job. Quick fixes and explorations benefit from conversational prompting, while production features deserve the rigor of specifications.
