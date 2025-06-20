// Reference: Createa_an_account.jpg
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { registerUser, redirectToDashboard } from '../../lib/auth';

export default function CreateAccountForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  const [loading, setLoading] = useState(false);
  
  // Check for role parameter in URL
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'employer', 'university'].includes(roleParam)) {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);
  
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: typeof errors = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await registerUser(formData);
      redirectToDashboard(user, router);
    } catch (error) {
      setErrors({
        general: 'Registration failed. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded border border-red-200">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          required
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
            Account Type
          </label>
          <select
            id="role"
            name="role"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            required
          >
            <option value="student">Student</option>
            <option value="employer">Employer</option>
            <option value="university">University</option>
          </select>
        </div>
        
        <div className="mb-6">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
        
        <Button 
          type="submit" 
          fullWidth
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
