import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { imp, trash, unImp, clip, Cancle, allSelect } from "../img";
import { Container } from "../topNav/TopNav";
import { getMailDetail, getUserSession, updateMailDetailWaste, updateMailReceiveImpToggle, updateMailSendImpToggle, updateMailWaste } from "../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../commons/WHComponent";
import Toast from "../commons/Toast";
import { useToastStore } from "../commons/modalStore";

const MobileShell = styled.div`
  width: 100vw;
  background: #fff;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 6px;
`;

const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #e1e7ec;
  background: #fff;
  color: #5f6b72;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  margin-left: 10px;
`;

const PageTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const TopActions = styled.div`
  margin-left: auto;
`;

const TopBtn = styled.button`
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  border: 1px solid #dfe5ea;
  background: #fff;
  color: #59636b;
  border-radius: 8px;
  cursor: pointer;
`;

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0 5px;
  font-size: 12px;
  color: #98a1a8;
`;
const TimeText = styled.div`
  font-size: 12px;
  flex: 1;
  margin-left: 10px;
`;
const MiniIconBtn = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #e1e7ec;
  background: #fff;
  color: #6b7680;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const PageDivider = styled.div`
  height: 2px;
  background: #2ec4b6;
  opacity: .6;
  border-radius: 2px;
  margin-bottom: 14px;
`;

const Card = styled.div`
  background: #fff;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const StarBtn = styled.button`
  padding: 0;
  margin: 0;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const StarImg = styled.img`
  width: 22px;
  height: 22px;
  display: block;
`;

const MailTitle = styled.h3`
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 2px;
  line-height: 1.4;
`;

const CardHr = styled.div`
  width: 372px;
  height: 1px;
  background: #D9D9D9;
  border: 0;
  margin: 12px 0 16px;
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  row-gap: 8px;
  column-gap: 8px;
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 10px;
`;

const MetaLabel = styled.div`
  font-size: 12px;
  line-height: 28px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: #DFFCF9;
  border: 1px solid #e0e7ec;
  font-size: 12px;
  color: #1f2937;
  margin-left: -20px;
`;
const ChipName = styled.span`
  font-weight: 600;
`;
const ChipEmail = styled.span`
`;

const BodyText = styled.div`
  height: 200px;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
  margin-left: 10px;
`;

const Attachment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  margin-left: 10px;
`;

const AttachmentIcon = styled.img`
  display: block;
  width: 14px;
  height: 14px;
  background: #fff;
  object-fit: contain;
`;

const AttachmentName = styled.a`
  font-size: 13px;
  color: #707070;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: 'none';
`;

const CardFooter = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const BoxButton = styled.input`
    width: 22px;
    height: 22px;
    border: 1px solid #aaa;
    border-radius: 3px;
    background-color: #fff;
    background-image: url(${allSelect});
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;
    outline: none;
`

export default function MailDetail() {
  const [loading, setLoading] = useState(true);
  const user = getUserSession();
  const [data, setData] = useState(null);
  const query = useQuery();
  const location = useLocation();
  const { mail_id } = useParams(); // 경로에서 mail_id 가져오기
  const params = new URLSearchParams(useLocation().search);
  const memId = params.get("memId"); // 쿼리에서 memId 가져오기
  const navigate = useNavigate();
  const stripHtmlTags = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "") || "";
  const { showToast } = useToastStore();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const yy = String(date.getFullYear()).slice(-2); // 연도 뒤 2자리
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월 0~11이므로 +1
    const dd = String(date.getDate()).padStart(2, '0'); // 일
    const hh = String(date.getHours()).padStart(2, '0'); // 시
    const min = String(date.getMinutes()).padStart(2, '0'); // 분
    return `${yy}-${mm}-${dd} ${hh}:${min}`;
  };

  useEffect(() => {
    if (!mail_id || !memId) return;  // 둘 다 없으면 실행하지 않음

    const mailIdNum = parseInt(mail_id, 10); // NaN 방지
    getMailDetailPage(mailIdNum, memId);
  }, [mail_id, memId]);

  async function getMailDetailPage(mail_id, memId) {
    try {
      let response = await getMailDetail(mail_id, memId);
      setData(response.data);
      console.log(response);
      setLoading(false);
    } catch (e) {
      console.log(e);
      alert("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  // 휴지통 보내기
  const handleWaste = async () => {

    try {
      const res = await updateMailDetailWaste(mail_id);

      console.log("서버 응답:", res);
      console.log("res.data:", res.data);

      if (res.data?.success) {
        showToast("휴지통으로 이동했습니다.");

        navigate(-1);
      } else {
        showToast("휴지통 이동 실패");
      }
    } catch (e) {
      console.error(e);
      showToast("에러가 발생했습니다.");
    }
  };

  // 중요 토글
  const handleToggleImp = async () => {
    if (!data?.detail || !user?.mem_id) return;

    const mail_id = data.detail.mail_id;
    const isReceiveMail = data.detail.mail_sender !== user.mem_id;

    const prevRimp = data.detail.mail_rimp;
    const prevSimp = data.detail.mail_simp;

    // 클라이언트에서 즉시 UI 변경
    setData(prev => {
      const updatedDetail = { ...prev.detail };

      if (isReceiveMail) {
        updatedDetail.mail_rimp = prevRimp === 0 ? 1 : 0;
      }

      if (!isReceiveMail) {
        updatedDetail.mail_simp = prevSimp === 0 ? 1 : 0;
      }

      return { ...prev, detail: updatedDetail };
    });

    try {
      if (isReceiveMail) {
        await updateMailReceiveImpToggle(mail_id);
      } else {
        await updateMailSendImpToggle(mail_id);
      }
    } catch (e) {
      console.error(e);
      // 실패 시 이전 상태로 롤백
      setData(prev => ({
        ...prev,
        detail: {
          ...prev.detail,
          mail_rimp: prevRimp,
          mail_simp: prevSimp,
        }
      }));
      alert("중요 상태 변경 실패");
    }
  };


  return (
    <>
      <MobileShell>
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {!loading && data &&
            data.detail &&
            < div style={{ padding: '5px 20px 24px' }}>
              <SubHeader>
                <TimeText>{formatDate(data.detail.mail_sender === user.mem_id ? data.detail.mail_sdate : data.detail.mail_rdate)}</TimeText>
                <BoxButton type='button' style={{ backgroundImage: `url(${trash})`, cursor: 'pointer' }} onClick={handleWaste}></BoxButton>
              </SubHeader>

              <PageDivider />

              <Card>
                <TitleRow>
                  <StarBtn >
                    <StarImg src={(data?.detail?.mail_rimp === 0 && data?.detail?.mail_simp === 0) ? unImp : imp} onClick={handleToggleImp} />
                  </StarBtn>
                  <div>
                    <MailTitle>{data.detail.mail_name}</MailTitle>
                  </div>
                </TitleRow>

                <Meta>
                  <MetaLabel>보낸 사람</MetaLabel>
                  <ChipRow>
                    <Chip>
                      <ChipName>{data.detail.sender_name}</ChipName>
                      <ChipEmail>{data.detail.sender_email}</ChipEmail>
                    </Chip>
                  </ChipRow>

                  <MetaLabel>받는 사람</MetaLabel>
                  <ChipRow>
                    <Chip>
                      <ChipName>{data.detail.receiver_name}</ChipName>
                      <ChipEmail>{data.detail.receiver_email}</ChipEmail>
                    </Chip>
                  </ChipRow>
                </Meta>

                <CardHr />
                <BodyText>{stripHtmlTags(data.detail.mail_desc)}</BodyText>

                {data.detail.mailFileList?.length > 0 && (
                  <Attachment>
                    <AttachmentIcon src={clip} />
                    <AttachmentName href={`/api/message/getFile?mafile_no=${data.detail.mailFileList[0].mafile_no}`}
                      fileName={data.detail.mailFileList[0].mafile_name.split('$$')[1]} onMouseDown={(e) => e.preventDefault()}>
                      {data.detail.mailFileList[0].mafile_name.split('$$')[1]}
                    </AttachmentName>
                  </Attachment>
                )}

                <CardHr />

                <CardFooter>
                  <Button onClick={() => navigate(-1)}>목록</Button>
                </CardFooter>
              </Card>
            </div>

          }
        </div>
      </MobileShell >
    </>
  );
}