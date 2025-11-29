
📘 구로병원 연구자 허브 - Next.js 구현 설계도

본 문서는 제공된 **HTML 프로토타입 파일들(v2, v4, v8_lite, v9, v10)**을 참조하여, Next.js (App Router) 기반의 단일 애플리케이션으로 통합 구축하기 위한 아키텍처 및 구현 가이드입니다.

1. 참조 소스 매핑 (Reference Mapping)

개발 시 각 라우트(URL)는 아래의 HTML 파일을 원본 디자인/로직으로 참조합니다.

라우트 경로 기능 명칭 참조 원본 파일 비고
/demographics 인력 구성 및 분포 dashboard_v2.html 도넛 차트, 누적 막대 차트
/performance 연구 성과 분석 dashboard_v4.html 이중축 차트, Box Plot
/platforms 연구 플랫폼 현황 dashboard_v8_lite.html Canvas 맵 제외됨, 2x2 그리드 레이아웃
/search 연구자 탐색 dashboard_v9.html 검색 UI, 상세 분할 뷰
/companies 기업 탐색 dashboard_v10.html 기업 검색, 웹 검색 토글
/ 메인 대시보드 (공통 KPI 사용) 각 페이지의 핵심 지표 요약

2. 프로젝트 초기화 및 환경 설정

2.1 프로젝트 생성

npx create-next-app@latest guro-research-hub --typescript --tailwind --eslint
cd guro-research-hub


2.2 필수 패키지 설치

# 차트 라이브러리
npm install chart.js react-chartjs-2 chartjs-plugin-datalabels @sgratzl/chartjs-chart-boxplot

# UI 유틸리티 및 아이콘
npm install react-icons clsx tailwind-merge


3. 프로젝트 폴더 구조 (Architecture)

/app
 ├── layout.tsx           # [공통] Sidebar 포함 전역 레이아웃
 ├── page.tsx             # [대시보드] KPI 요약
 ├── demographics/        # [페이지] 인력 구성 (Ref: v2)
 │   └── page.tsx
 ├── performance/         # [페이지] 성과 분석 (Ref: v4)
 │   └── page.tsx
 ├── platforms/           # [페이지] 플랫폼 현황 (Ref: v8_lite)
 │   └── page.tsx
 ├── search/              # [페이지] 연구자 탐색 (Ref: v9)
 │   └── page.tsx
 └── companies/           # [페이지] 기업 탐색 (Ref: v10)
     └── page.tsx

/components
 ├── layout/
 │   └── Sidebar.tsx      # 사이드바 컴포넌트 (Active Link 처리)
 ├── charts/              # 차트 관련
 │   ├── ChartRegistry.tsx # Chart.js 전역 등록기
 │   └── NetworkMap.tsx    # (Canvas) 연구자 네트워크 맵
 └── ui/                  # 재사용 UI
     └── Card.tsx         # (선택사항) 공통 카드 스타일

/lib
 └── mockData.ts          # 데이터 중앙화 (HTML 내부 스크립트 데이터 이관)