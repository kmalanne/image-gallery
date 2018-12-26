import React, { SFC } from 'react';

export interface IconProps {
  color?: string;
  icon: string;
  size?: number;
}

export const Icon: SFC<IconProps> = props => {
  const color = props.color ? props.color : '#fafafa';
  const size = props.size ? props.size : 32;

  const styles = {
    path: { fill: color },
  };

  return (
    <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 48 48">
      <path style={styles.path} d={props.icon} />
    </svg>
  );
};
