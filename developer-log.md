# Developer Log — AI-Augmented Engineering

This document describes how AI tools were used throughout the development of the Cart Challenge project, including strategy, human audit moments, and verification.


## 1. AI Strategy

I used **Microsoft Copilot**, **Claude**, and **Cursor**. I provided clear context and spelled out the features, behaviors, and look I needed, with examples (Amazon’s search bar was one source of inspiration). I read and understood the AI’s suggestions before putting them into the codebase. I often had to refine the output—for example, styled-components CSS, import paths, file structure, and preferring styled-components over inline styles. I also relied on AI for debugging and for setting up linting and other tooling for a solid development experience at the start of the project. I kept a clear roadmap and updated it throughout.

---

## 2. Human Audit Moments

I pushed back mainly on the architecture the AI suggested: there was no dedicated “store” file and no Redux-style state management, unlike what I was used to. The AI explained its approach, and I used that as a learning opportunity. I was also the one checking the real UI: I verified the rendered pages, responsiveness, and components, and fixed or adjusted the styling. I replaced most of the AI-generated inline styles with reusable styled-components. I was also responsible for adjusting the roadmap and making trade-offs on initially planned features as the deadline got closer.

### **Audit #1 — CartContext Refactor**
AI initially produced a context with unclear responsibilities and mixed concerns.  
I corrected it by:

- Splitting logic into clean add/remove/increment/decrement functions  
- Ensuring pure functions  
- Improving readability and maintainability  

This resulted in a more predictable and testable store.

---

### **Audit #2 — TypeScript Build Errors After Upgrade**
AI suggested changes that caused 200+ TypeScript errors.  
I manually:

- Removed unused tsBuildInfoFile settings  
- Updated TypeScript to 5.5  
- Added vitest/globals  
- Added path aliases to tsconfig  
- Fixed strict typing in test utilities  

This stabilized the build and allowed deployment.

---

### **Audit #3 — CartPage UI and responsiveness**
The initial AI output for the cart page had poor UI: there was no “Back to shop” button, and the layout was not responsive. I manually added the “Back to shop” button and improved the layout so the cart page works well on different screen sizes.

---

## 3. Verification & Testing

AI helped generate initial test cases for:

- Cart logic  
- ProductPage loading  
- Category filtering  

I manually verified:

- Edge cases (incrementing quantity, removing items, empty cart)  
- API error handling  
- Routing behavior  
- UI rendering under different states  

I also used AI to generate test scaffolding, then refined the mocks and assertions to ensure correctness.

---

## 4. Reflections

AI significantly accelerated development, especially for:

- Boilerplate generation  
- Debugging  
- TypeScript inference  
- Documentation  

Human oversight was essential for:

- Architecture  
- Type safety  
- Routing correctness  
- Build stability  
- Production deployment  

The final result is a clean, functional, well‑structured React + TypeScript application delivered efficiently with AI assistance.
