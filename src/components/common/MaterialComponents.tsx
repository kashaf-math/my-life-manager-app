import React from 'react';
import { Material3ColorScheme } from '../../theme/materialTheme';

// Material 3 Button
interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'danger';
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'filled',
  icon,
  children,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-9 px-3 text-xs rounded-full gap-1.5',
    md: 'h-10 px-5 text-sm rounded-full gap-2 font-medium',
    lg: 'h-12 px-6 text-base rounded-full gap-2.5 font-medium',
  }[size];

  const variantClasses = {
    filled: 'bg-[#6750A4] text-white hover:bg-[#5b4692] active:bg-[#4f3c80] shadow-sm',
    tonal: 'bg-[#E8DEF8] text-[#1D192B] dark:bg-[#4A4458] dark:text-[#E8DEF8] hover:bg-[#ded1f3] active:bg-[#d4c3ee]',
    outlined: 'border border-[#79747E] dark:border-[#938F99] text-[#6750A4] dark:text-[#D0BCFF] hover:bg-[#6750A4]/8 active:bg-[#6750A4]/12',
    text: 'text-[#6750A4] dark:text-[#D0BCFF] hover:bg-[#6750A4]/8 active:bg-[#6750A4]/12',
    danger: 'bg-[#BA1A1A] text-white hover:bg-[#a01616] active:bg-[#851212]',
  }[variant];

  const disabledClass = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer active:scale-[0.98] transition-all duration-150';

  return (
    <button
      className={`inline-flex items-center justify-center tracking-wide font-sans ${sizeClasses} ${variantClasses} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

// Material 3 Card
interface M3CardProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const M3Card: React.FC<M3CardProps> = ({
  variant = 'elevated',
  children,
  className = '',
  onClick,
}) => {
  const variantClasses = {
    elevated: 'bg-[#F3EDF7] dark:bg-[#211F26] shadow-sm border border-[#E7E0EC]/40 dark:border-[#49454F]/40',
    filled: 'bg-[#ECE6F0] dark:bg-[#2B2930]',
    outlined: 'bg-[#FEF7FF] dark:bg-[#141218] border border-[#CAC4D0] dark:border-[#49454F]',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-4 md:p-5 transition-shadow duration-200 ${variantClasses} ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// Material 3 Text Field
interface M3TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  multiline?: boolean;
  rows?: number;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  supportingText?: string;
  error?: string;
}

export const M3TextField: React.FC<M3TextFieldProps> = ({
  label,
  multiline = false,
  rows = 3,
  leadingIcon,
  trailingIcon,
  supportingText,
  error,
  className = '',
  value,
  id,
  ...props
}) => {
  const inputId = id || `m3_input_${label.replace(/\s+/g, '_').toLowerCase()}`;
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className={`relative flex flex-col mb-1 ${className}`}>
      <div
        className={`relative flex items-center bg-[#ECE6F0] dark:bg-[#2B2930] rounded-2xl border-b-2 transition-all duration-200 px-3.5 pt-4 pb-1.5 ${
          error
            ? 'border-[#BA1A1A] dark:border-[#FFB4AB]'
            : 'border-[#79747E] focus-within:border-[#6750A4] dark:focus-within:border-[#D0BCFF]'
        }`}
      >
        {leadingIcon && (
          <span className="mr-3 text-[#49454F] dark:text-[#CAC4D0] flex-shrink-0">
            {leadingIcon}
          </span>
        )}

        <div className="relative flex-1">
          <label
            htmlFor={inputId}
            className={`absolute left-0 transition-all duration-150 pointer-events-none select-none text-xs font-medium ${
              hasValue ? '-top-3 text-[#6750A4] dark:text-[#D0BCFF]' : 'top-0 text-[#49454F] dark:text-[#CAC4D0]'
            } ${error ? '!text-[#BA1A1A] dark:!text-[#FFB4AB]' : ''}`}
          >
            {label}
          </label>

          {multiline ? (
            <textarea
              id={inputId}
              rows={rows}
              value={value}
              className="w-full bg-transparent text-[#1D1B20] dark:text-[#E6E0E9] text-sm focus:outline-none resize-none pt-2"
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={inputId}
              value={value}
              className="w-full bg-transparent text-[#1D1B20] dark:text-[#E6E0E9] text-sm focus:outline-none pt-2"
              {...props}
            />
          )}
        </div>

        {trailingIcon && (
          <span className="ml-2 text-[#49454F] dark:text-[#CAC4D0] flex-shrink-0">
            {trailingIcon}
          </span>
        )}
      </div>

      {(error || supportingText) && (
        <span
          className={`text-xs px-3 mt-1 ${
            error ? 'text-[#BA1A1A] dark:text-[#FFB4AB] font-medium' : 'text-[#49454F] dark:text-[#CAC4D0]'
          }`}
        >
          {error || supportingText}
        </span>
      )}
    </div>
  );
};

// Material 3 Circular Progress
interface M3CircularProgressProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  className?: string;
}

export const M3CircularProgress: React.FC<M3CircularProgressProps> = ({
  progress,
  size = 110,
  strokeWidth = 9,
  showText = true,
  className = '',
}) => {
  const safeProgress = Math.min(100, Math.max(0, isNaN(progress) ? 0 : progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[#E8DEF8] dark:text-[#4A4458]"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-[#6750A4] dark:text-[#D0BCFF] transition-all duration-500 ease-out"
          fill="none"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-[#1D1B20] dark:text-[#E6E0E9]">
            {safeProgress}%
          </span>
          <span className="text-[10px] uppercase font-semibold text-[#6750A4] dark:text-[#D0BCFF] -mt-0.5">
            Progress
          </span>
        </div>
      )}
    </div>
  );
};

// Material 3 Linear Progress
interface M3LinearProgressProps {
  progress: number;
  className?: string;
}

export const M3LinearProgress: React.FC<M3LinearProgressProps> = ({
  progress,
  className = '',
}) => {
  const safeProgress = Math.min(100, Math.max(0, isNaN(progress) ? 0 : progress));

  return (
    <div className={`w-full h-2 bg-[#E8DEF8] dark:bg-[#4A4458] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-[#6750A4] dark:bg-[#D0BCFF] rounded-full transition-all duration-300 ease-out"
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
};

// Material 3 Chip
interface M3ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const M3Chip: React.FC<M3ChipProps> = ({
  label,
  selected = false,
  onClick,
  onDelete,
  icon,
  className = '',
}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium transition-colors select-none ${
        selected
          ? 'bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF] border border-transparent'
          : 'bg-transparent text-[#49454F] dark:text-[#CAC4D0] border border-[#79747E] dark:border-[#938F99] hover:bg-[#6750A4]/8'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1.5 hover:opacity-75 focus:outline-none"
        >
          ✕
        </button>
      )}
    </span>
  );
};

// Material 3 Floating Action Button (FAB)
interface M3FabProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  className?: string;
}

export const M3Fab: React.FC<M3FabProps> = ({ icon, label, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 right-6 z-30 inline-flex items-center justify-center bg-[#EADDFF] text-[#21005D] dark:bg-[#4F378B] dark:text-[#EADDFF] shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 ${
        label ? 'h-14 px-5 rounded-2xl gap-3 font-medium text-sm' : 'w-14 h-14 rounded-2xl'
      } ${className}`}
    >
      <span className="text-xl">{icon}</span>
      {label && <span>{label}</span>}
    </button>
  );
};

// Material 3 Modal Dialog
interface M3DialogProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: 'filled' | 'danger';
  children: React.ReactNode;
}

export const M3Dialog: React.FC<M3DialogProps> = ({
  isOpen,
  title,
  onClose,
  confirmLabel,
  onConfirm,
  confirmVariant = 'filled',
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FEF7FF] dark:bg-[#211F26] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#CAC4D0]/30 dark:border-[#49454F]/40 flex flex-col max-h-[90vh]">
        <h3 className="text-xl font-semibold text-[#1D1B20] dark:text-[#E6E0E9] mb-4">
          {title}
        </h3>
        <div className="flex-1 overflow-y-auto mb-6 text-sm text-[#49454F] dark:text-[#CAC4D0]">
          {children}
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#CAC4D0]/20 dark:border-[#49454F]/30">
          <M3Button variant="text" onClick={onClose}>
            Cancel
          </M3Button>
          {confirmLabel && onConfirm && (
            <M3Button variant={confirmVariant} onClick={onConfirm}>
              {confirmLabel}
            </M3Button>
          )}
        </div>
      </div>
    </div>
  );
};
