import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...props }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <ImageWrapper ref={ref}>
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          onLoad={handleLoad}
          $isLoaded={isLoaded}
          {...props}
        />
      )}
      <Placeholder $isLoaded={isLoaded && isVisible} />
    </ImageWrapper>
  );
};

export default LazyImage;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Image = styled.img<{ $isLoaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${(props) => (props.$isLoaded ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const Placeholder = styled.div<{ $isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--gray-200);
  opacity: ${(props) => (props.$isLoaded ? 0 : 1)};
  transition: opacity 0.5s ease-in-out;
  /* Ensure placeholder is behind the image */
  z-index: -1;
`;