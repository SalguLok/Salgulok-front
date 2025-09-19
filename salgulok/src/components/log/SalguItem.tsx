import styled from "styled-components";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import SalguOff from "../../assets/common/salgu_off.svg";
import Salgu from "../../assets/common/salgu.svg";
import SalguPlus from "../../assets/common/salgu_plus.svg";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";

import { getEntryDates, type LogEntryDateListResponse } from "../../api/logEntry/getEntryDates";

type Props = {
    date?: string;
    hasLog?: "yes" | "no";
    onClick?: () => void;
    forceOff?: boolean;
    isoDate?: string;
    logId?: number;
    thumbnailKeyOrUrl?: string | null;
    usePresigned?: boolean;
};

type DateMap = Map<string, LogEntryDateListResponse["items"][number]>;
const entryDatesCache: Map<number, DateMap> = new Map();
const isFullUrl = (v?: string | null) => !!v && /^https?:\/\//i.test(v || "");

/* 특정 logId의 날짜 리스트를 캐시에 로드 */
async function ensureDatesLoaded(logId: number): Promise<DateMap> {
    if (entryDatesCache.has(logId)) return entryDatesCache.get(logId)!;
    const data = await getEntryDates(logId);
    const map: DateMap = new Map();
    for (const it of data.items) {
        // 키: "YYYY-MM-DD"
        map.set(it.entryDate, it);
    }
    entryDatesCache.set(logId, map);
    return map;
}

const SalguItem: FC<Props> = ({
                                  date = "00/00",
                                  hasLog,
                                  onClick,
                                  forceOff,
                                  isoDate,
                                  logId,
                                  thumbnailKeyOrUrl,
                                  usePresigned = true,
                              }) => {
    const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
    const [derivedHasLog, setDerivedHasLog] = useState<"yes" | "no">(hasLog ?? "no");
    const [displayDate, setDisplayDate] = useState<string>(date);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // 날짜 표시는 isoDate가 있으면 그것을 "MM/DD"로 포맷해서 사용
    useEffect(() => {
        if (isoDate) {
            try {
                // isoDate: YYYY-MM-DD
                const mmdd = isoDate.slice(5).replace("-", "/"); // "09-19" -> "09/19"
                setDisplayDate(mmdd);
            } catch {
                setDisplayDate(date);
            }
        } else {
            setDisplayDate(date);
        }
    }, [isoDate, date]);

    // 대표 이미지 찾아서 presigned까지 처리
    useEffect(() => {
        (async () => {
            try {
                // 강제 비활성화면 아이콘으로
                if (forceOff) {
                    setResolvedSrc(null);
                    setDerivedHasLog("no");
                    return;
                }

                // 1) 우선 외부에서 바로 값이 들어오면 그걸 사용
                let keyOrUrl = thumbnailKeyOrUrl ?? null;

                // 2) 아니고 logId + isoDate가 있으면, 날짜 리스트에서 탐색
                if (!keyOrUrl && logId && isoDate) {
                    const map = await ensureDatesLoaded(logId);
                    const item = map.get(isoDate);
                    if (item) {
                        // TODO: 배포위해 일단 주석처리!! 수정필요
                        // keyOrUrl = item.thumbnailUrl ?? null;
                        setDerivedHasLog(item.templateCount && item.templateCount > 0 ? "yes" : "no");
                    } else {
                        setDerivedHasLog("no");
                    }
                } else if (hasLog) {
                    // hasLog prop이 넘어온 경우에는 그대로 반영
                    setDerivedHasLog(hasLog);
                }

                if (!keyOrUrl) {
                    setResolvedSrc(null);
                    return;
                }

                // 3) keyOrUrl이 full URL이면 그대로 사용
                if (isFullUrl(keyOrUrl)) {
                    setResolvedSrc(keyOrUrl);
                    return;
                }

                // 4) objectKey면 presigned 발급하여 실제 URL로 변환
                if (usePresigned) {
                    // TODO: 배포위해 일단 임시로 ""로 설정. 120-121번째줄 확인 필요!!
                    // const { url } = await issueGetPresigned(keyOrUrl);
                    const url = "";
                    if (mountedRef.current) setResolvedSrc(url ?? null);
                } else {
                    setResolvedSrc(null);
                }
            } catch (e) {
                // 실패 시 대표 이미지는 사용하지 않고 아이콘으로 폴백
                if (mountedRef.current) setResolvedSrc(null);
                if (!hasLog && !isoDate) setDerivedHasLog("no");
                console.error("SalguItem resolve image error:", e); 
            }
        })();
        // thumbnailKeyOrUrl, logId, isoDate가 바뀌면 재시도
    }, [thumbnailKeyOrUrl, logId, isoDate, usePresigned, forceOff, hasLog]);

    const iconSrc = forceOff
        ? SalguOff
        : derivedHasLog === "yes"
            ? Salgu
            : SalguPlus;

    const alt = forceOff
        ? "살구로그 비활성"
        : derivedHasLog === "yes"
            ? "살구로그 있음"
            : "살구로그 없음";

    return (
        <Layout onClick={onClick} role={onClick ? "button" : undefined}>
            {/* 대표 이미지가 준비되면 그걸 렌더, 아니면 기존 아이콘 사용 */}
            {resolvedSrc ? (
                <Icon src={resolvedSrc} alt="살구로그 대표이미지" />
            ) : (
                <Icon src={iconSrc} alt={alt} />
            )}
            <Date>{displayDate}</Date>
        </Layout>
    );
};

export default SalguItem;


const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;
const Icon = styled.img`
  width: 41px;
  height: 46px;
  object-fit: cover; 
  border-radius: 6px; 
`;
const Date = styled.span`
  font-size: 11px;
  color: var(--gray-400);
`;