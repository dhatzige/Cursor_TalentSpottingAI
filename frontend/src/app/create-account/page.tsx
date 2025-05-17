// Reference: Createa_an_account.jpg
import CreateAccountForm from './CreateAccountForm';

export default function CreateAccountPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-900">TalentSpottingAI</h1>
        <p className="text-gray-600 mt-2">Create your account to get started</p>
      </div>
      
      <CreateAccountForm />
    </main>
  );
}
