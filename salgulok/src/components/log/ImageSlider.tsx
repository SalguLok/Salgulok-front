import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";

type ImgLike = string | { url: string };

interface ImageSliderProps {
  images?: ImgLike[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const safeImages = useMemo<string[]>(
    () =>
      images?.length
        ? images
            .map((it) => (typeof it === "string" ? it : it.url))
            .filter(Boolean)
        : ["https://via.placeholder.com/600x400?text=No+Image"],
    [images]
  );

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (i: number) =>
    setCurrent(
      ((i % safeImages.length) + safeImages.length) % safeImages.length
    );
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
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  const showNav = safeImages.length > 1;

  return (
    <Slider
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <Track $index={current}>
        {safeImages.map((src, i) => (
          <Slide
            key={`${src}-${i}`}
            role="group"
            aria-label={`${i + 1} / ${safeImages.length}`}
          >
            <SlideImage src={src} alt={` 이미지 ${i + 1}`} />
          </Slide>
        ))}
      </Track>

      {showNav && (
        <>
          <NavButton onClick={prev} aria-label="이전">
            ‹
          </NavButton>
          <NavButton onClick={next} aria-label="다음" $right>
            ›
          </NavButton>
        </>
      )}
    </Slider>
  );
};

export default ImageSlider;

const Slider = styled.div`
  position: relative;
  overflow: hidden;
  outline: none;
  margin-bottom: 10px;
`;

const Track = styled.div<{ $index: number }>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  height: 100%;
  transform: translateX(${(p) => `-${p.$index * 100}%`});
  transition: transform 300ms ease;
`;

const Slide = styled.div`
  position: relative;
  width: 181px;
  height: 139px;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background-color: var(--gray-300);
`;

const NavButton = styled.button<{ $right?: boolean }>`
  position: absolute;
  top: 50%;
  ${(p) => (p.$right ? "right: 8px;" : "left: 8px;")}
  transform: translateY(-50%);
  border: none;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 20px;
  line-height: 1;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
`;
