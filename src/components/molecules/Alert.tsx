import { toast } from 'react-hot-toast';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';
import successIcon from '@/assets/alert/success-icon.svg';
import errorIcon from '@/assets/alert/error-icon.svg';
import warningIcon from '@/assets/alert/warning-icon.svg';
import infoIcon from '@/assets/alert/info-icon.svg';
import closeIcon from '@/assets/alert/close-icon.svg';
import Image from 'next/image';

interface AlertProps {
  variant: AlertVariant;
  title: string;
  subtext?: string;
  isDismissible?: boolean;
  onDismiss?: () => void; // Optional: if custom dismiss logic is needed beyond react-hot-toast
}

const iconPaths: Record<AlertVariant, string> = {
  success: successIcon,
  error: errorIcon,
  warning: warningIcon,
  info: infoIcon,
};

const variantStyles: Record<
  AlertVariant,
  {
    bg: string;
    iconContainerBg?: string;
    titleColor: string;
    subtextColor: string;
    iconColor: string;
    borderColor: string;
  }
> = {
  success: {
    bg: 'bg-[#E7F6EC]',
    titleColor: 'text-[#101928]',
    subtextColor: 'text-[#667185]',
    iconColor: '#0F973D',
    borderColor: 'border-transparent',
  },
  error: {
    bg: 'bg-[#FBEAE9]',
    titleColor: 'text-[#101928]',
    subtextColor: 'text-[#667185]',
    iconColor: '#D42620',
    borderColor: 'border-transparent',
  },
  warning: {
    bg: 'bg-[#FEF6E7]',
    titleColor: 'text-[#101928]',
    subtextColor: 'text-[#667185]',
    iconColor: '#F3A218',
    borderColor: 'border-transparent',
  },
  info: {
    bg: 'bg-[#E3EFFC]',
    titleColor: 'text-[#101928]',
    subtextColor: 'text-[#667185]',
    iconColor: '#1671D9',
    borderColor: 'border-transparent',
  },
};

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  subtext,
  isDismissible = true,
  onDismiss,
}) => {
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      toast.dismiss(); // Default behavior if no onDismiss is provided
    }
  };

  const styles = variantStyles[variant];

  const baseClasses = `grid gap-4 items-start grid-cols-[max-content_1fr_max-content] p-4 w-[343px] rounded-lg shadow-[0px_1px_2px_0px_rgba(11,3,45,0.08)] ${styles.bg} ${styles.borderColor}`;

  const iconContainerClasses =
    'bg-white rounded-full flex w-[3rem] h-[3rem] items-center justify-center';

  const textSectionClasses = 'flex flex-col gap-1 flex-grow';

  const titleClasses = `font-medium text-base ${styles.titleColor}`;

  const subtextClasses = `text-sm ${styles.subtextColor}`;

  return (
    <div className={baseClasses} role="alert" aria-live="assertive">
      <span className={iconContainerClasses}>
        <Image src={iconPaths[variant]} alt={`${variant} icon`} className="" />
      </span>

      <div className={textSectionClasses}>
        <p className={titleClasses}>{title}</p>
        {subtext && <p className={subtextClasses}>{subtext}</p>}
      </div>

      {isDismissible && (
        <button
          onClick={handleDismiss}
          className="ml-auto p-1 rounded-full hover:opacity-50 transition-opacity duration-200 flex-shrink-0" // Adjusted margin and hover
          aria-label="Close alert"
        >
          <Image src={closeIcon} alt="Close icon" className="" />
        </button>
      )}
    </div>
  );
};

export default Alert;
