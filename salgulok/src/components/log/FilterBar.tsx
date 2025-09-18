import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import SortIcon from "../../assets/log/filter.svg?react";
import DownIcon from "../../assets/log/down.svg?react";

/** 정렬 키 UI 라벨 */
const SORT_LABELS = {
    like: "인기순",
    view: "조회순",
    latest: "최신순",
} as const;
type SortKey = keyof typeof SORT_LABELS;

export interface RegionOption {
    id: number;
    name: string;
}

interface Props {
    /** 퍼블리싱 전용: 외부에서 초기값만 넣고, 내부에서 상태 관리 */
    defaultSort?: SortKey;
    defaultRegionId?: number | null;
    regions: RegionOption[];
    className?: string;

    /** 선택적으로 콜백 받을 수 있음(없으면 내부 상태만 변경하고 끝) */
    onChangeSort?: (next: SortKey) => void;
    onChangeRegion?: (id: number | null) => void;
}

const FilterBar: React.FC<Props> = ({
                                        defaultSort = "latest",
                                        defaultRegionId = null,
                                        regions,
                                        className,
                                        onChangeSort,
                                        onChangeRegion,
                                    }) => {
    // 내부 선택 상태(퍼블리싱 전용)
    const [sort, setSort] = useState<SortKey>(defaultSort);
    const [regionId, setRegionId] = useState<number | null>(defaultRegionId);

    const [openSortMenu, setOpenSortMenu] = useState(false);
    const [openRegionMenu, setOpenRegionMenu] = useState(false);

    const sortDdRef = useRef<HTMLDivElement | null>(null);
    const regionDdRef = useRef<HTMLDivElement | null>(null);

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const onOutside = (e: PointerEvent) => {
            if (sortDdRef.current && !sortDdRef.current.contains(e.target as Node)) {
                setOpenSortMenu(false);
            }
            if (regionDdRef.current && !regionDdRef.current.contains(e.target as Node)) {
                setOpenRegionMenu(false);
            }
        };
        window.addEventListener("pointerdown", onOutside);
        return () => window.removeEventListener("pointerdown", onOutside);
    }, []);

    const currentSortLabel = SORT_LABELS[sort];
    const currentRegionLabel =
        regionId != null ? regions.find((r) => r.id === regionId)?.name ?? "지역" : "지역";

    // 키보드 접근성(ESC로 닫기, Enter로 선택)
    const onMenuKeyDown =
        (close: () => void, onEnter?: () => void) =>
            (e: React.KeyboardEvent) => {
                if (e.key === "Escape") {
                    e.stopPropagation();
                    close();
                }
                if (e.key === "Enter" && onEnter) {
                    e.preventDefault();
                    onEnter();
                }
            };

    // 클릭 핸들러(퍼블리싱)
    const handleSortClick = () => {
        setOpenSortMenu((v) => !v);
        if (openRegionMenu) setOpenRegionMenu(false);
    };
    const handleRegionClick = () => {
        setOpenRegionMenu((v) => !v);
        if (openSortMenu) setOpenSortMenu(false);
    };

    // 선택 핸들러(내부 상태만 변경, 콜백은 있으면 호출)
    const selectSort = (key: SortKey) => {
        setSort(key);
        onChangeSort?.(key);
        setOpenSortMenu(false);
    };
    const selectRegion = (id: number | null) => {
        setRegionId(id);
        onChangeRegion?.(id);
        setOpenRegionMenu(false);
    };

    return (
        <Bar className={className} role="group" aria-label="정렬 및 지역 필터(퍼블리싱)">
            {/* 정렬 드롭다운 */}
            <Dropdown ref={sortDdRef}>
                <Chip
                    as="button"
                    type="button"
                    onClick={handleSortClick}
                    aria-expanded={openSortMenu}
                    aria-haspopup="listbox"
                    $active={openSortMenu}
                >
                    <IconWrapper>
                        <SortIcon />
                    </IconWrapper>
                    {currentSortLabel}
                </Chip>

                {openSortMenu && (
                    <Menu
                        role="listbox"
                        tabIndex={-1}
                        onKeyDown={onMenuKeyDown(() => setOpenSortMenu(false))}
                    >
                        {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                            <MenuItem
                                key={key}
                                role="option"
                                aria-selected={sort === key}
                                onClick={() => selectSort(key)}
                                onKeyDown={onMenuKeyDown(() => setOpenSortMenu(false), () => selectSort(key))}
                            >
                                {SORT_LABELS[key]}
                            </MenuItem>
                        ))}
                    </Menu>
                )}
            </Dropdown>

            {/* 지역 드롭다운 */}
            <Dropdown ref={regionDdRef}>
                <Chip
                    as="button"
                    type="button"
                    onClick={handleRegionClick}
                    aria-expanded={openRegionMenu}
                    aria-haspopup="listbox"
                    $active={openRegionMenu || regionId != null}
                >
                    {currentRegionLabel}
                    <IconWrapper>
                        <DownIcon />
                    </IconWrapper>
                </Chip>

                {openRegionMenu && (
                    <Menu
                        role="listbox"
                        tabIndex={-1}
                        onKeyDown={onMenuKeyDown(() => setOpenRegionMenu(false))}
                    >
                        <MenuItem
                            role="option"
                            aria-selected={regionId == null}
                            onClick={() => selectRegion(null)}
                            onKeyDown={onMenuKeyDown(() => setOpenRegionMenu(false), () => selectRegion(null))}
                        >
                            전체 지역
                        </MenuItem>
                        {regions.map((r) => (
                            <MenuItem
                                key={r.id}
                                role="option"
                                aria-selected={regionId === r.id}
                                onClick={() => selectRegion(r.id)}
                                onKeyDown={onMenuKeyDown(() => setOpenRegionMenu(false), () => selectRegion(r.id))}
                            >
                                {r.name}
                            </MenuItem>
                        ))}
                    </Menu>
                )}
            </Dropdown>
        </Bar>
    );
};

export default FilterBar;

/* ===== Styles ===== */

const Bar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Chip = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px; /* 6px에서 4px로 수정 */
  padding: 9px 12px;
  border-radius: 9999px;
  background: #fff;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9e9e9;
  color: #444;

  //&:hover {
  //  border-color: #cfcfcf;
  //}

  ${({ $active }) =>
    $active &&
    css`
      border-color: #222;
      color: #111;
    `}
`;

const Dropdown = styled.div`
  position: relative;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;

  svg {
    width: 100%;
    height: 100%;
    path {
      fill: currentColor;
    }
  }
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 140px;
  max-height: 240px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 6px;
  z-index: 10;
`;

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  font-size: 13px;
  line-height: 1;
  padding: 10px 10px;
  border: 0;
  background: transparent;
  border-radius: 8px;
  color: #333;
  cursor: pointer;

  &:hover {
    background: #f6f6f6;
  }

  &[aria-selected="true"] {
    background: #f0f0f0;
    font-weight: 600;
  }
`;
