// Reference: Role_selector.jpg
import RoleCard from './RoleCard';
import '../gradient-bg.css';

const roles = [
  {
    title: 'Student',
    description: 'Find job opportunities and connect with employers',
    icon: '/icons/student.svg',
    link: '/student-dashboard',
    bgColor: 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 hover:border-blue-400'
  },
  {
    title: 'Employer',
    description: 'Post jobs and discover talent',
    icon: '/icons/employer.svg',
    link: '/organization-dashboard',
    bgColor: 'bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 hover:border-green-400'
  },
  {
    title: 'University',
    description: 'Manage university presence and help students',
    icon: '/icons/university.svg',
    link: '/university-dashboard',
    bgColor: 'bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 hover:border-purple-400'
  }
];

export default function RoleSelectorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Join TalentSpottingAI
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2 max-w-md text-lg font-medium">
          Choose your role to get started with the right experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {roles.map((role) => (
          <div key={role.title} className="transform hover:scale-105 transition-transform duration-300">
            <RoleCard
              title={role.title}
              description={role.description}
              icon={role.icon}
              link={role.link}
              bgColor={role.bgColor}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Sign in here
          </a>
        </p>
      </div>
    </main>
  );
}
