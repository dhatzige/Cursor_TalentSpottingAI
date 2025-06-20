// Reference: Login.jpg
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../components/Button';
import Input from '../components/Input';
import Link from 'next/link';
import { loginUser, redirectToDashboard } from '../../lib/auth';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    
    // Simple validation
    const newErrors: typeof errors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await loginUser(formData.email, formData.password);
      redirectToDashboard(user, router);
    } catch (error) {
      setErrors({
        general: 'Invalid email or password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h2>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded border border-red-200">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot password?
          </Link>
        </div>
        
        <Button
          type="submit"
          fullWidth
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
