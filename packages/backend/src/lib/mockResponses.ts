// Mock responses for demo mode (no OpenAI required)

export const MOCK_QUESTIONS = [
  // Question 1
  `Thank you for starting this AI readiness assessment! I'm your AI Business Consultant from Minerva Consultores.

**Question 1 of 14: Business Context**

Let's begin by understanding your business. What industry does your company operate in, and what are the main products or services you offer?`,

  // Question 2
  `Great, thank you for that context!

**Question 2 of 14: Business Pain Points**

What are the top 2-3 operational challenges or pain points your business currently faces? These could be related to efficiency, costs, customer experience, or any other area where you see room for improvement.`,

  // Question 3
  `Those are very common challenges that AI can often help address.

**Question 3 of 14: Data Infrastructure**

How would you describe your current data infrastructure? Do you have centralized data storage, and how accessible is your business data for analysis?`,

  // Question 4
  `Thank you for sharing that.

**Question 4 of 14: Data Quality**

How would you rate the quality and consistency of your business data? Is it well-structured, clean, and regularly maintained?`,

  // Question 5
  `I see. Data quality is crucial for AI success.

**Question 5 of 14: Technical Capabilities**

Does your organization have in-house technical capabilities (developers, data analysts, IT team) that could support AI implementation, or would you rely primarily on external partners?`,

  // Question 6
  `That's helpful context.

**Question 6 of 14: Process Documentation**

How well-documented are your core business processes? Are there standard operating procedures in place?`,

  // Question 7
  `Good to know.

**Question 7 of 14: Change Management**

How would you describe your organization's culture when it comes to adopting new technologies? Is there generally openness to change?`,

  // Question 8
  `Change readiness is important for successful AI adoption.

**Question 8 of 14: Budget Considerations**

What level of investment is your organization prepared to consider for an initial AI pilot project?

A) Under $10,000
B) $10,000 - $50,000
C) $50,000 - $150,000
D) Over $150,000`,

  // Question 9
  `Thank you for that information.

**Question 9 of 14: Timeline Expectations**

What is your expected timeline for seeing results from an AI implementation?

A) 1-3 months (quick wins)
B) 3-6 months
C) 6-12 months
D) 12+ months (strategic transformation)`,

  // Question 10 - Multiple Choice
  `**Question 10 of 14: AI Readiness Self-Assessment**

Based on your organization's current state, which best describes your self-assessed AI readiness level?

A) **Beginner** - Just starting to learn about AI possibilities
B) **Intermediate** - Some understanding, exploring use cases
C) **Advanced** - Dedicated team, some AI implementations in place
D) **Expert** - AI is already core to our strategy`,

  // Question 11 - Multiple Choice
  `Thank you for that honest self-assessment.

**Question 11 of 14: Strategic Intent**

What is the primary goal of your interest in AI?

A) **Experimentation** - Learn about AI, run small pilots
B) **Tool Adoption** - Solve specific business problems
C) **Strategic Transformation** - Build long-term competitive advantage through AI`,

  // Question 12
  `**Question 12 of 14: Priority Areas**

Which business function would you prioritize for an initial AI pilot?

A) Customer Service / Support
B) Sales & Marketing
C) Operations / Manufacturing
D) Finance / Administration
E) HR / People Operations
F) Product Development`,

  // Question 13
  `**Question 13 of 14: Success Metrics**

How would you measure success for an AI pilot project? What would make it worthwhile for your organization?`,

  // Question 14 - Final
  `**Question 14 of 14: Additional Context**

Is there anything else you'd like to share about your business situation, challenges, or AI aspirations that would help me provide better recommendations?`,
];

export const MOCK_REPORT = `# AI Pilot Project Readiness Report

**Prepared for:** Your Company
**Date:** ${new Date().toLocaleDateString()}
**Prepared by:** Minerva Consultores | Powered by Agentize.eu

---

## Executive Summary

Based on your assessment responses, your organization shows **moderate AI readiness** with strong potential for successful pilot implementations. We've identified several high-impact opportunities aligned with your business context.

**Overall Readiness Score: 3.4/5**

---

## Readiness Scorecard

| Dimension | Score | Assessment |
|-----------|-------|------------|
| Business Pain Points | 4.0/5 | Clear, addressable challenges identified |
| Data Readiness | 3.0/5 | Moderate - some improvements needed |
| Organizational Readiness | 3.5/5 | Good foundation, change management support needed |
| Process Maturity | 3.2/5 | Processes exist but documentation could improve |
| Strategic Priorities | 3.8/5 | Well-defined priorities and success metrics |

**Strategic Intent:** Tool Adoption - Focused on solving specific business problems

---

## Priority AI Pilot Projects

### 🥇 Priority #1: Intelligent Customer Support Assistant

**Business Impact:** High
**Implementation Complexity:** Medium
**Time to Value:** 2-3 months

**Description:**
An AI-powered chatbot and agent assistant that can handle routine customer inquiries, provide instant responses 24/7, and escalate complex issues to human agents with full context.

**Expected Benefits:**
- 40-60% reduction in response time
- 30% decrease in support ticket volume
- Improved customer satisfaction scores
- Free up human agents for complex issues

**Implementation Approach:**
1. Audit existing customer support data and FAQs
2. Select and configure AI platform (e.g., custom GPT, Intercom AI)
3. Train on company-specific knowledge base
4. Pilot with limited customer segment
5. Measure and iterate

**Estimated Investment:** $15,000 - $35,000

---

### 🥈 Priority #2: Sales Intelligence & Lead Scoring

**Business Impact:** High
**Implementation Complexity:** Medium
**Time to Value:** 3-4 months

**Description:**
AI-driven analysis of prospect behavior, historical sales data, and market signals to automatically score and prioritize leads, enabling your sales team to focus on the highest-potential opportunities.

**Expected Benefits:**
- 25-40% improvement in lead conversion rates
- Better resource allocation in sales team
- Data-driven insights for sales strategy
- Reduced time spent on low-quality leads

**Implementation Approach:**
1. Integrate CRM and sales data sources
2. Define ideal customer profile and scoring criteria
3. Implement ML-based lead scoring model
4. Create dashboards and alerts
5. Train sales team on new workflow

**Estimated Investment:** $25,000 - $50,000

---

### 🥉 Priority #3: Document Processing Automation

**Business Impact:** Medium-High
**Implementation Complexity:** Low-Medium
**Time to Value:** 1-2 months

**Description:**
Automate the extraction, classification, and processing of business documents (invoices, contracts, reports) using AI-powered document understanding.

**Expected Benefits:**
- 70-80% reduction in manual data entry
- Faster document processing times
- Reduced errors in data extraction
- Better compliance and audit trails

**Implementation Approach:**
1. Identify high-volume document types
2. Select document AI solution
3. Configure extraction templates
4. Integrate with existing workflows
5. Monitor and improve accuracy

**Estimated Investment:** $10,000 - $25,000

---

## Recommendations & Next Steps

### Immediate Actions (Next 30 Days)
1. ✅ Review this report with key stakeholders
2. ✅ Select one pilot project to pursue
3. ✅ Conduct detailed data audit for selected use case
4. ✅ Schedule consultation with Minerva Consultores

### Short-term (1-3 Months)
1. Begin pilot implementation with selected project
2. Establish success metrics and monitoring
3. Create internal AI governance guidelines
4. Identify AI champions within organization

### Medium-term (3-6 Months)
1. Evaluate pilot results and document learnings
2. Plan rollout or expansion of successful pilots
3. Develop AI roadmap for next 12-18 months
4. Build or acquire additional AI capabilities

---

## About This Assessment

This report was generated based on your responses to our 14-question AI readiness assessment. The recommendations are tailored to your specific business context, challenges, and goals.

For a detailed implementation plan, technical requirements, and personalized consultation, please contact us.

---

**Minerva Consultores**
AI Strategy & Implementation Partners

📧 contact@minerva-consultores.com
🌐 www.minerva-consultores.com

*Powered by Agentize.eu*
`;

export function getMockResponse(questionIndex: number): string {
  if (questionIndex < MOCK_QUESTIONS.length) {
    return MOCK_QUESTIONS[questionIndex];
  }
  return MOCK_REPORT;
}

