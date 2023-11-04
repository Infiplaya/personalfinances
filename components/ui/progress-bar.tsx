import { TargetType } from '@/db/queries/targets';
import { cn } from '@/lib/utils';
import React from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressCircleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: Size;
  color?: 'red';
  showAnimation?: boolean;
  tooltip?: string;
  radius?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  targetType: TargetType;
}

const size2config: Record<Size, { strokeWidth: number; radius: number }> = {
  xs: {
    radius: 15,
    strokeWidth: 3,
  },
  sm: {
    radius: 19,
    strokeWidth: 4,
  },
  md: {
    radius: 32,
    strokeWidth: 6,
  },
  lg: {
    radius: 52,
    strokeWidth: 8,
  },
  xl: {
    radius: 80,
    strokeWidth: 10,
  },
};

function getLimitedValue(input: number | undefined) {
  if (input === undefined) {
    return 0;
  } else if (input > 100) {
    return 100;
  } else {
    return input;
  }
}

const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  (props, ref) => {
    const {
      value: inputValue,
      size = 'md',
      radius: inputRadius,
      strokeWidth: inputStrokeWidth,
      targetType,
      children,
      ...other
    } = props;

    // sanitize input
    const value = getLimitedValue(inputValue);
    const radius = inputRadius ?? size2config[size].radius;
    const strokeWidth = inputStrokeWidth ?? size2config[size].strokeWidth;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = (value / 100) * circumference;
    const offset = circumference - strokeDashoffset;

    return (
      <>
        <div
          ref={ref}
          className="flex flex-col items-center justify-center"
          {...other}
        >
          <svg
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            className="-rotate-90 transform"
          >
            <circle
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
              stroke=""
              strokeLinecap="round"
              className="stroke-violet-500/25 transition-colors ease-linear"
            />
            {value > 0 ? (
              <circle
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                strokeDashoffset={offset}
                fill="transparent"
                stroke=""
                strokeLinecap="round"
                className={cn(
                  'transition-colors ease-linear',
                  getColor(value, targetType)
                )}
              />
            ) : null}
          </svg>
          <div className={'absolute flex'}>{children}</div>
        </div>
      </>
    );
  }
);

function getColor(value: number, type: TargetType) {
  if (type === 'limit') {
    switch (true) {
      case value > 50 && value < 80:
        return 'stroke-yellow-500';
      case value > 80 && value < 100:
        return 'stroke-orange-500';
      case value >= 100:
        return 'stroke-red-500';
      default:
        return 'stroke-violet-500';
    }
  } else {
    switch (true) {
      case value > 50 && value < 80:
        return 'stroke-yellow-500';
      case value > 80:
        return 'stroke-green-500';
      default:
        return 'stroke-violet-500';
    }
  }
}

ProgressCircle.displayName = 'ProgressCircle';

export default ProgressCircle;
