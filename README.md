# 자치행정 협력사업 신청 현황

`신청목록.json`의 지자체, 사업명, 예산을 카드로 표시하고 5억원(500,000천원) 한도 기준으로 승인·반려를 자동 판정하는 정적 웹페이지입니다. 신청 자료를 정리한 Google Sheets 게시본도 iframe으로 표시합니다.

## 구성

- `index.html` - 페이지 구조
- `styles.css` - 반응형 화면 디자인
- `app.js` - JSON 로드, 검색, 필터, 자동 판정, Sheets 임베드
- `data/applications.json` - 신청 데이터 10건
- `.nojekyll` - GitHub Pages 정적 파일 처리용

## GitHub Pages 배포

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더 안의 파일과 `data/` 폴더를 저장소 최상위에 업로드합니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
5. 브랜치는 `main`, 폴더는 `/(root)`를 선택하고 저장합니다.

잠시 후 Pages 화면에 표시되는 주소로 접속하면 됩니다.

## 판정 기준 변경

`app.js`의 `BUDGET_LIMIT` 값을 수정합니다. 현재 값은 `500000`이며 단위는 천원입니다.

## Google Sheets 변경

`app.js`의 `SHEET_EMBED_URL`에 Google Sheets의 **파일 → 공유 → 웹에 게시 → 임베드**에서 얻은 iframe `src` 주소를 입력합니다.
