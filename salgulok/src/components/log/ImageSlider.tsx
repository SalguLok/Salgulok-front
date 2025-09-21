import React, { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";

interface ImageSliderProps {
  images?: string[];
  title: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, title }) => {
  const safeImages = useMemo(
    () =>
      images?.length
        ? images
        : ["https://via.placeholder.com/600x400?text=No+Image"],
    [images]
  );
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (i: number) =>
    setCurrent(() => (i + safeImages.length) % safeImages.length);
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  return (
    <Slider
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label={`${title} 이미지 슬라이더`}
    >
      <Track $index={current} $count={safeImages.length}>
        {safeImages.map((src, i) => (
          <Slide
            key={i}
            role="group"
            aria-label={`${i + 1} / ${safeImages.length}`}
          >
            <SlideImage src={src} alt={`${title} 이미지 ${i + 1}`} />
          </Slide>
        ))}
      </Track>
      {safeImages.length > 1 && (
        <>
          <NavButton onClick={prev} aria-label="이전">
            ‹
          </NavButton>
          <NavButton onClick={next} aria-label="다음" $right>
            ›
          </NavButton>
          <Dots>
            {safeImages.map((_, i) => (
              <Dot
                key={i}
                aria-label={`${i + 1}번째로 이동`}
                $active={i === current}
                onClick={() => goTo(i)}
              />
            ))}
          </Dots>
        </>
      )}
    </Slider>
  );
};

export default ImageSlider;

const Slider = styled.div`
  position: relative;
  width: 100%;
  height: 190px;
  border-radius: 12px;
  overflow: hidden;
  outline: none;
`;
const Track = styled.div<{ $index: number; $count: number }>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  height: 100%;
  transform: translateX(${(p) => `-${p.$index * 100}%`});
  transition: transform 350ms ease;
`;

const Slide = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const NavButton = styled.button<{ $right?: boolean }>`
  position: absolute;
  top: 50%;
  ${(p) =>
    p.$right
      ? css`
          right: 8px;
        `
      : css`
          left: 8px;
        `}
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 22px;
  line-height: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const Dots = styled.div`
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
`;

const Dot = styled.button<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: ${(p) => (p.$active ? "#fb923c" : "rgba(255,255,255,0.7)")};
  outline: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
`;
