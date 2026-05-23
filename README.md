# Connectosphere 웹사이트 — 배포 및 사용 가이드

## 파일 구조

```
connectosphere/
├── index.html       메인 페이지 (타이틀 + Enter + 영상 + 발굴 현장)
├── intro.html       전시 서문
├── location.html    로케이션
├── team.html        팀 소개
├── rewatch.html     인트로 다시보기
├── style.css        공통 스타일
├── script.js        인터랙션 로직
├── 0522.mp4         영상 파일 (Tae님이 추가)
└── IMG_2701.PNG     마지막 프레임 이미지 (Tae님이 추가)
```

---

## 빠른 시작 — 5단계

### 1단계: 폴더에 영상과 이미지 추가

받은 파일들이 있는 폴더에 두 파일을 *그대로 같은 폴더*에 넣어주세요.

- `0522.mp4` — 완성된 26초 영상
- `IMG_2701.PNG` — 영상 마지막 프레임 이미지

### 2단계: 로컬에서 미리 확인

폴더에서 `index.html`을 **더블클릭**해서 브라우저로 열어보세요.

다만 — 브라우저 보안 정책 때문에 *영상 자동재생이 로컬에서는 일부 제한*될 수 있습니다. 그래도 *Enter 버튼*을 클릭하면 영상이 재생되어야 합니다. 5개 클릭 영역도 확인 가능합니다.

만약 로컬에서 작동이 이상하면 — 호스팅 배포 후에는 정상 작동하니, *바로 배포 단계로 넘어가셔도 됩니다*.

### 3단계: 영상 압축 (현재 100MB → 권장 10-20MB)

GitHub Pages는 파일당 100MB 한계가 있고, 100MB는 모바일 로딩이 너무 느립니다.

**HandBrake로 압축:**
1. handbrake.fr에서 다운로드 (무료)
2. `0522.mp4` 열기
3. Preset → "Web → Vimeo YouTube HQ 1080p60"
4. Video 탭 → Quality → Constant Quality → RF 값 **24** 설정
5. Audio 탭 → 비트레이트 128 kbps
6. "Save As" 위치 지정 후 "Start Encode"

압축된 파일 이름을 `0522.mp4`로 유지하면 됩니다.

### 4단계: GitHub Pages로 배포

**GitHub 계정이 없다면:**
1. github.com 가입 (무료)

**저장소 생성 및 업로드:**
1. github.com에서 "New repository" 클릭
2. Repository name: `connectosphere` 입력
3. **Public** 선택 (무료 호스팅을 위해 필수)
4. "Create repository" 클릭
5. 다음 화면에서 "uploading an existing file" 링크 클릭
6. 폴더 안의 *모든 파일을 드래그*해서 업로드
7. "Commit changes" 클릭

**Pages 활성화:**
1. 저장소의 "Settings" 탭 클릭
2. 왼쪽 메뉴에서 "Pages" 클릭
3. "Source" → "Deploy from a branch" 선택
4. Branch → "main" 선택, 폴더 → "/ (root)" 선택
5. "Save" 클릭
6. 1~5분 대기

**완료:** 사이트 주소는 `https://{사용자명}.github.io/connectosphere/`

### 5단계: ngrok 주소 업데이트 (필요할 때마다)

박지원님 ngrok 주소가 바뀌면:

1. GitHub 저장소에서 `script.js` 파일 클릭
2. 우측 상단의 연필 아이콘 (Edit) 클릭
3. 9번째 줄 근처:
   ```javascript
   dataSiteUrl: "https://unwed-evasion-cabbage.ngrok-free.dev",
   ```
   따옴표 안의 URL만 새 주소로 변경
4. 페이지 하단에서 "Commit changes" 클릭
5. 1~5분 후 사이트 자동 반영

---

## 디자인 조정 — 자주 묻는 항목들

### 5개 오브제 클릭 영역 좌표 미세 조정

현재 좌표는 IMG_2701.PNG를 기준으로 *대략적으로* 측정한 값입니다.
실제 사이트에서 *오브제와 클릭 영역이 정확히 일치하지 않으면*, `index.html`에서 각 hotspot의 좌표를 조정합니다.

`index.html`의 hotspot 부분 (60-100번 줄 근처):

```html
<a href="intro.html"
   class="hotspot hotspot--intro"
   style="left: 4%; top: 38%; width: 17%; height: 50%;"   ← 이 값 조정
   aria-label="전시 서문">
```

- `left`: 좌측 끝에서 시작 위치 (0~100%)
- `top`: 상단에서 시작 위치 (0~100%)
- `width`: 영역 가로 크기 (%)
- `height`: 영역 세로 크기 (%)

브라우저 개발자 도구(F12)를 열고 *Elements* 탭에서 hotspot을 클릭하면 *어디가 클릭 영역인지 표시*됩니다. 그것을 보면서 미세 조정.

### 색상 변경

`style.css` 상단 (15-30번 줄)의 `:root` 변수들을 수정하면 사이트 전체 색상이 한 번에 바뀝니다.

```css
--cyan-bright: #4dd4e0;   /* 메인 액센트 — 모놀리스 발광 톤 */
--bg-base:     #0e1416;   /* 페이지 배경 */
```

### 마커(클릭 가능 표시) 끄기

5개 오브제 위의 *맥동하는 점*이 디자인적으로 거슬리면, `style.css`에서:

```css
.hotspot__marker {
  display: none;
}
```

이렇게 추가하면 마커가 사라지고 *호버 시에만 영역이 표시*됩니다.

---

## 트러블슈팅

### Q. 영상이 재생되지 않아요
- 영상 파일이 정확히 `0522.mp4`라는 이름으로 같은 폴더에 있는지 확인
- 영상 파일이 100MB 이상이면 GitHub 업로드가 거부될 수 있음 — 압축 필요

### Q. 5개 오브제 위치가 어긋나 있어요
- IMG_2701.PNG가 영상 마지막 프레임과 정확히 같은 이미지인지 확인
- 좌표는 *백분율 기준*이라 화면 크기가 바뀌어도 자동 조정되지만, 미세 조정은 위 가이드 참조

### Q. 모바일에서 클릭 영역이 너무 작아요
- 현재 코드는 모바일에서 *라벨이 항상 표시*되도록 설정되어 있음
- 클릭 영역 자체를 더 크게 하려면 `index.html`의 `width`와 `height` 값을 늘리기

### Q. ngrok 주소가 바뀌었는데 어떻게 업데이트하나요?
- 위 "5단계" 참조

### Q. 사이트가 안 보여요 (배포 후 1시간 지나도)
- GitHub Pages 설정에서 Source가 "main" branch / "/" root로 되어 있는지 확인
- 저장소 이름이 `connectosphere`인지 확인
- 주소가 `https://{사용자명}.github.io/connectosphere/` 형식인지 확인

---

## 추가 작업 가능 항목 (선택사항)

다음은 *현재 사이트가 작동한 후*에 시간이 되면 고려할 수 있는 개선사항들:

1. **SEO 메타데이터** — Open Graph 태그 추가 (SNS 공유 시 미리보기)
2. **파비콘** — 브라우저 탭의 작은 아이콘
3. **로딩 인디케이터** — 영상 로딩 중 표시
4. **클릭 영역 마커 디자인** — 더 정교한 시각적 단서
5. **백그라운드 음악** — 메인 화면 진입 전 ambient sound
6. **모바일 세로 모드 최적화** — 더 큰 클릭 영역

필요하시면 추가 작업 요청 부탁드립니다.

---

## 작업 우선순위

오늘 안에 완성을 위해:

1. ✅ **즉시:** 영상과 이미지 폴더에 넣고 `index.html` 더블클릭으로 확인
2. ✅ **30분 내:** 영상 압축 (HandBrake)
3. ✅ **1시간 내:** GitHub 저장소 생성 + 파일 업로드 + Pages 활성화
4. ✅ **2시간 내:** 사이트 접속 확인, 5개 클릭 영역 미세 조정
5. ✅ **3시간 내:** 모바일/데스크탑에서 테스트, 최종 톤 조정

문제 생기면 즉시 알려주세요. 미세 조정·디버깅 함께 진행하겠습니다.
