<Climb>
  <header>
    <id>IJRx</id>
    <type>feature</type>
    <description>Refactor the Vercel AI Chatbot to use OpenRouter, remove authentication, and add persona selection.</description>
    <newDependencies>
      - @openrouter/ai-sdk-provider
    </newDependencies>
    <prerequisiteChanges>
      - Environment variables for Supabase (URL and service_role key) must be correctly set in .env.
    </prerequisiteChanges>
    <relevantFiles>
      - app/api/chat/route.ts (Core chat logic)
      - middleware.ts (Authentication enforcement)
      - components/chat.tsx (Frontend chat UI and state)
      - auth.ts (Server-side auth helper)
      - supabase/migrations/20230707053030_init.sql (DB Schema)
      - package.json (Dependencies)
      - components/ui/ (for new UI elements)
    </relevantFiles>
  </header>
  
  ## Feature Overview
  
  **Feature Name:** OpenRouter Integration & Auth Removal
  
  **Purpose Statement:** To refactor the chatbot application to remove the mandatory user authentication requirement, switch the LLM provider from OpenAI to OpenRouter, and introduce a persona selection feature. This will make the chatbot more accessible, flexible, and engaging for users.
  
  **Problem Being Solved:**
  1. The current chatbot uses a deprecated  package.
  2. It forces users to sign up/log in, creating a barrier to entry.
  3. It lacks model/persona flexibility.
  4. API keys are not handled in a user-friendly way for a public-facing tool.
  
  **Success Metrics:**
  - Users can interact with the chatbot without logging in.
  - Chat history is preserved throughout a browser session for anonymous users.
  - LLM calls are successfully routed through OpenRouter.
  - Users can enter their OpenRouter API key through the UI.
  - Users can select between a 'serious' and 'fun' persona, and the bot's responses reflect the choice.
  
  ## Requirements
  
  **Functional Requirements:**
  1.  **Anonymous Access:** The login/signup requirement must be completely removed.
  2.  **Session-based persistence:** Chat history must be tied to a session (e.g., via chat ID stored in local storage) and saved in the Supabase database.
  3.  **LLM Provider Change:** All LLM calls must go through OpenRouter using the Vercel AI SDK and . The  package should be removed.
  4.  **User-provided API Key:** The UI must contain a field for the user to enter their OpenRouter API key. This key should be stored in the browser's local storage and used for all API requests. The application should not start a chat if the key is not provided.
  5.  **Persona Selection:** The UI must provide a way for the user to select one of two personas: 'Serious' or 'Fun'.
  6.  **System Prompts:** The selected persona will determine the system prompt sent with the chat request, influencing the chatbot's tone and style.
  
  **Technical Requirements:**
  1. The application must be deployable to Netlify (i.e., no Python or other non-JS/TS backend components).
  2. The changes to the database schema (if any) and RLS policies must be minimal and secure. The primary approach should be to handle logic within the API route using Supabase's service role key to bypass RLS for anonymous chat persistence.
  3. The  hook from the Vercel AI SDK should remain the core of the frontend chat state management.
  
  **User Requirements:**
  1. A first-time visitor should be able to start a conversation immediately after entering their API key.
  2. If the user closes and reopens their browser, their previous conversation should be loaded and continued.
  3. The user should be able to switch personas, and the change should take effect on the next message sent.
  
  ## Design and Implementation
  
  **User Flow:**
  1. User visits the site.
  2. A dialog prompts the user to enter their OpenRouter API key.
  3. A control (e.g., a dropdown or switch) is visible for selecting a persona. Default is 'Serious'.
  4. User enters their key and saves it. The dialog closes.
  5. User types a message and submits.
  6. The frontend sends the message, the full conversation history, the API key, and the selected persona/system prompt to the backend API route.
  7. The backend API uses the provided key to make a call to the OpenRouter API.
  8. The response is streamed back to the user.
  9. The complete conversation (including the assistant's response) is saved to Supabase. The chat is associated with a unique chat ID, but the  is NULL.
  
  **Architecture Overview:**
  - **Frontend (Next.js/React):** The  component will be modified to include the API key dialog and persona selector. It will manage the state for these new features and pass them in the body of the  hook's requests.
  - **Backend (Next.js API Route):** The  will be heavily modified. It will no longer check for a user session. It will receive the API key and persona from the request body, initialize the OpenRouter client with them, and then make the LLM call. It will use the Supabase service role client to save the chat history for anonymous users.
  - **Authentication:**  will be modified to remove the redirect for unauthenticated users.  and other user-auth-related UI components (, ) will be removed.
  - **Database (Supabase):** No schema changes are planned. The existing  table will be used, with  being  for anonymous chats. RLS policies will be bypassed by the service role key in the API route, so no policy changes are needed.
  
  ## Development Details
  
  **Implementation Considerations:**
  - The OpenRouter API key will be passed from client to server on every request. This is a requirement as we cannot store user-specific keys in the backend. This is acceptable for this project's scope but has security implications in a broader context (key is visible in browser's network requests).
  - The two system prompts for the personas need to be defined.
    - **Serious:** "You are a serious, knowledgeable assistant. You are direct, concise, and do not use embellishments or sycophantic language. Your tone is that of a wise, older mentor."
    - **Fun:** "You are a witty, fun-loving assistant who is a bit of a ball-breaker. You always provide the correct answer, but you do so with sarcasm, humor, and a playful attitude. You enjoy poking fun at the user in a lighthearted way."
</Climb>
