## service worker로 라우터별 새 빌드 파일 적용하기

## 1. 설명
- SPA에서는 새로운 파일이 빌드되어도, 유저가 사이트에 진입한 상태라면 새로운 화면을 볼 수 없는 문제가 있다.
- 그래서 빌드시 `manifest.json`에 `{ 라우터명: 라우터 해쉬 파일명 }`을 저장하고, (1) 서비스 워커가 실행될 때, (2) 빌드 완료시 의도적인 트리거가 발생할 때 해쉬된 `manifest.json`과 현재 `manifest.json`데이터를 비교한다.
- 비교 후, 현재 유저가 보고 있는 화면의 라우터 해쉬 파일명이 변경되었다면, "새로고침을 해라!" 하는 모달창을 띄운다.
- 핵심 로직을 `service-worker.ts`에서 담당한다.

<img width="500px" src="https://github.com/KumJungMin/pwa-service-worker-build-updater/blob/main/src/assets/docs/service-worker-logic.jpg" />


<br/>


## 2. 테스트 예시
### 1) 사이트 진입시 캐시 데이터를 체크하는 경우

1. 특정 `.vue`파일을 수정한다.


<img width="700px" src="https://github.com/KumJungMin/pwa-service-worker-build-updater/blob/main/src/assets/docs/update-1.png" />

<br/>

2. 빌드 명령어를 실행한다.
```bash
pnpm run build
```

<img width="700px" src="https://github.com/KumJungMin/pwa-service-worker-build-updater/blob/main/src/assets/docs/update-2.png" />

<br/>


3. 빌드된 파일(`/dist`)을 기반으로 사이트를 실행한다.
```bash
pnpm run preview
```

<br/>


4. 사이트 진입시 아래 과정을 거친다.
- (1) 서비스 워커를 등록하고,
- (2) 최신 manifest.json 파일과 캐시된 manifest.json 파일을 비교한다.
- (3) 만약 라우터 파일의 해쉬 데이터가 다르다면, 업데이트 팝업창을 띄운다.
- (4) [새로고침]을 클릭하면, 사이트가 리로드되면서 최신 빌드 파일이 반영된다.

<img width="700px" src="https://github.com/KumJungMin/pwa-service-worker-build-updater/blob/main/src/assets/docs/update-3.png" />


<br/>


### 2) 캐시 데이터 비교를 트리거하는 경우

- [빌드 업데이트 체크] 버튼 클릭시, 캐시 데이터 비교 로직이 실행된다.

<img width="700px" src="https://github.com/KumJungMin/pwa-service-worker-build-updater/blob/main/src/assets/docs/trigger.png" />
