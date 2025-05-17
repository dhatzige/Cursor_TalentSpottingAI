// Reference: Role_selector.jpg
import RoleCard from './RoleCard';

const roles = [
  {
    title: 'Student',
    description: 'Find job opportunities and connect with employers',
    icon: '/icons/student.svg',
    link: '/student-dashboard',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  {
    title: 'Employer',
    description: 'Post jobs and discover talent',
    icon: '/icons/employer.svg',
    link: '/organization-dashboard',
    bgColor: 'bg-green-50 hover:bg-green-100'
  },
  {
    title: 'University',
    description: 'Promote your institution and help students find opportunities',
    icon: '/icons/university.svg',
    link: '/university-dashboard',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  }
];

export default function RoleSelectorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-blue-900">Choose Your Role</h1>
        <p className="text-gray-600 mt-2 max-w-md">
          Select how you'd like to use TalentSpottingAI based on your role
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {roles.map((role) => (
          <RoleCard
            key={role.title}
            title={role.title}
            description={role.description}
            icon={role.icon}
            link={role.link}
            bgColor={role.bgColor}
          />
        ))}
      </div>
    </main>
  );
}
