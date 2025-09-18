import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getLogDetail, type LogDetailResponse } from "../../api/log/getLogDetail";

type Props = {
    logId: number;
};

const LogDetailHeader: React.FC<Props> = ({ logId }) => {
    const [logDetail, setLogDetail] = useState<LogDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogDetail = async () => {
            try {
                setLoading(true);
                const data = await getLogDetail(logId);
                setLogDetail(data);
            } catch (err) {
                setError("Failed to fetch log details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogDetail();
    }, [logId]);

    if (loading) {
        return <Wrapper>Loading...</Wrapper>;
    }

    if (error) {
        return <Wrapper>{error}</Wrapper>;
    }

    if (!logDetail) {
        return null;
    }

    const { title, startDate, endDate } = logDetail;

    return (
        <Wrapper>
            <Title>{title}</Title>
            <Period>
                {formatDot(startDate)} ~ {formatDot(endDate)}
            </Period>
        </Wrapper>
    );
};

export default LogDetailHeader;

// YYYY-MM-DD -> YYYY.MM.DD
function formatDot(s: string) {
    return s.replace(/-/g, ".");
}

const Wrapper = styled.div`
  padding: 12px 20px 8px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 15px;
  font-weight: 700;
  color: #222;
  margin: 0;
`;

const Period = styled.span`
  font-size: 14px;
  color: #888;
`;