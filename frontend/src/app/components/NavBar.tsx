// Reference: All screenshots with navigation
import Link from "next/link";

const navLinks = [
  { href: "/homepage", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/create-account", label: "Sign Up" },
  { href: "/role-selector", label: "Roles" },
  { href: "/admin-dashboard", label: "Admin" },
  { href: "/student-dashboard", label: "Student" },
  { href: "/organization-dashboard", label: "Organization" },
  { href: "/university-dashboard", label: "University" },
  { href: "/employers", label: "Employers" },
  { href: "/students", label: "Students" },
  { href: "/universities", label: "Universities" },
  { href: "/blog", label: "Blog" },
];

export default function NavBar() {
  return (
    <nav className="w-full bg-gray-900 text-white px-4 py-3 flex gap-4 items-center shadow">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:underline hover:text-blue-400 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
