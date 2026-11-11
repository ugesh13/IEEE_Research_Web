import React from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
  title?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '', title }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div className={`overflow-x-auto py-2 my-1 ${className}`} title={title}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

  return <span className={`inline-block ${className}`} dangerouslySetInnerHTML={{ __html: html }} title={title} />;
};

