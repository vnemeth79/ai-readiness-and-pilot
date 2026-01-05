import { useState } from 'react';
import { Building2, User, Mail, Briefcase, Users, ArrowRight, Shield } from 'lucide-react';
import { MinervaLogo, PoweredBy } from './PoweredBy';
import type { ClientInfo } from '../types';

interface ClientInfoFormProps {
  onSubmit: (info: ClientInfo) => void;
  isLoading: boolean;
}

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-1000', label: '201-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

export function ClientInfoForm({ onSubmit, isLoading }: ClientInfoFormProps) {
  const [formData, setFormData] = useState<ClientInfo>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactRole: '',
    companySize: '',
  });
  const [errors, setErrors] = useState<Partial<ClientInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientInfo> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Your name is required';
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }
    if (!formData.contactRole.trim()) {
      newErrors.contactRole = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ClientInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-minerva-black via-minerva-charcoal to-minerva-black flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <MinervaLogo />
          <PoweredBy />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-minerva-gray/30 backdrop-blur-lg border border-gray-800 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Let's Get Started
              </h2>
              <p className="text-gray-400">
                Tell us about yourself so we can personalize your assessment
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField
                icon={<Building2 className="w-5 h-5" />}
                label="Company Name"
                required
                error={errors.companyName}
              >
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Acme Corporation"
                  className="form-input"
                  disabled={isLoading}
                />
              </FormField>

              <FormField
                icon={<User className="w-5 h-5" />}
                label="Your Name"
                required
                error={errors.contactName}
              >
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder="John Smith"
                  className="form-input"
                  disabled={isLoading}
                />
              </FormField>

              <FormField
                icon={<Mail className="w-5 h-5" />}
                label="Business Email"
                required
                error={errors.contactEmail}
              >
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="john@acme.com"
                  className="form-input"
                  disabled={isLoading}
                />
              </FormField>

              <FormField
                icon={<Briefcase className="w-5 h-5" />}
                label="Your Role"
                required
                error={errors.contactRole}
              >
                <input
                  type="text"
                  value={formData.contactRole}
                  onChange={(e) => handleChange('contactRole', e.target.value)}
                  placeholder="VP of Technology"
                  className="form-input"
                  disabled={isLoading}
                />
              </FormField>

              <FormField
                icon={<Users className="w-5 h-5" />}
                label="Company Size"
              >
                <select
                  value={formData.companySize}
                  onChange={(e) => handleChange('companySize', e.target.value)}
                  className="form-input"
                  disabled={isLoading}
                >
                  <option value="">Select size (optional)</option>
                  {COMPANY_SIZES.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Privacy Notice */}
              <div className="flex items-start gap-3 p-4 bg-minerva-black/50 rounded-xl border border-gray-800">
                <Shield className="w-5 h-5 text-minerva-red flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500">
                  Your information is stored securely and used only for this assessment 
                  and follow-up communication. You can request access to or deletion of 
                  your data at any time.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 btn-minerva disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Starting Assessment...
                  </>
                ) : (
                  <>
                    Begin Assessment
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <PoweredBy />
          </div>
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: rgba(45, 45, 45, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: rgba(196, 30, 58, 0.5);
          background: rgba(45, 45, 45, 0.8);
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

function FormField({ 
  icon, 
  label, 
  required, 
  error, 
  children 
}: { 
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
        <span className="text-minerva-red">{icon}</span>
        {label}
        {required && <span className="text-minerva-red">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
