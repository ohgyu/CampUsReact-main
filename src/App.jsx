import { createGlobalStyle } from 'styled-components'
import CampusMain from './components/campus/CampusMain'
import { BrowserRouter } from 'react-router-dom'

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;

  }
  body{
    font-family: 'pretendard'
  }
    .react-datepicker {
    font-size: 14px;       /* 전체 폰트 크기 */
  }

  .react-datepicker__header {
    padding: 4px;          /* 상단 헤더 패딩 */
  }

  .react-datepicker__day, 
  .react-datepicker__day-name {
    width: 20px;           /* 날짜 버튼 크기 */
    line-height: 25px;
  }
`

function App() {

  return (
    <>
      <BrowserRouter>
        <GlobalStyle />
        <CampusMain />
      </BrowserRouter>
    </>
  )
}

export default App
