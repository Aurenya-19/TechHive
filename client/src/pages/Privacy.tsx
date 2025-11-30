export default function Privacy() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-secondary">Last updated: November 2024</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-secondary">
            CodeVerse ("we", "our", or "us") operates the CodeVerse platform. This Privacy Policy explains our practices regarding the collection, use, and disclosure of your personal information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
          <p className="text-secondary">We collect the following types of information:</p>
          <ul className="list-inside list-disc space-y-2 text-secondary">
            <li>Profile information (name, email, profile picture) from Google OAuth</li>
            <li>Learning preferences and interests you provide during onboarding</li>
            <li>Activity data (challenges completed, projects created, quests done)</li>
            <li>Messages and communications within the platform</li>
            <li>Technical data (IP address, browser type, device information)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
          <p className="text-secondary">We use collected information to:</p>
          <ul className="list-inside list-disc space-y-2 text-secondary">
            <li>Provide and improve the CodeVerse learning platform</li>
            <li>Personalize your learning experience</li>
            <li>Enable collaboration with other users</li>
            <li>Track your progress and provide recommendations</li>
            <li>Maintain security and prevent fraud</li>
            <li>Send notifications about your activity</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p className="text-secondary">
            We implement industry-standard security measures to protect your personal information. Your data is encrypted in transit and at rest. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Third-Party Services</h2>
          <p className="text-secondary">
            We use Google OAuth for authentication. Google's privacy practices are governed by their own privacy policy. We also use OpenAI services for the AI Copilot feature. Please review their respective privacy policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Data Retention</h2>
          <p className="text-secondary">
            We retain your personal information for as long as your account is active or as needed to provide services. You can request deletion of your account and associated data at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Your Rights</h2>
          <p className="text-secondary">
            You have the right to access, update, or delete your personal information. To exercise these rights, please contact us through the app or email us directly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
          <p className="text-secondary">
            If you have questions about this Privacy Policy, please contact us through the CodeVerse platform or email us at privacy@codeverse.com
          </p>
        </section>
      </div>
    </div>
  );
}
