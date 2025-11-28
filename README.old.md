# Guro Hospital Researcher Hub - Technical Design Document

**Project Name:** Guro Researcher Hub (구로병원 연구자 허브)  
**Version:** 1.0.0  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Recommended) or Firebase, Recharts  
**Deployment:** Vercel (via GitHub Integration)

---

## 1. Architecture Overview (아키텍처 개요)

본 프로젝트는 **Next.js 14 App Router**를 기반으로 하여 서버 사이드 렌더링(SSR)과 정적 생성(SSG)의 장점을 결합한 하이브리드 웹 애플리케이션입니다.

### 1.1 Tech Stack
* **Frontend:** React, Next.js, TypeScript, Tailwind CSS, shadcn/ui (Component Library).
* **Visualization:** Recharts (Data Visualization).
* **Backend/DB:** Supabase (PostgreSQL) - *관계형 데이터 및 통계 처리에 유리함.*
* **Auth:** Supabase Auth (or NextAuth.js).
* **Hosting & CI/CD:** Vercel (GitHub Push Trigger).

### 1.2 Deployment Pipeline
1.  **Local Dev:** VS Code에서 개발 및 `git commit`.
2.  **Version Control:** GitHub Repository에 `push`.
3.  **CI/CD:** Vercel이 변경 사항 감지 -> Build -> Automatic Deploy.
4.  **Production:** `https://guro-research-hub.vercel.app` (예시 도메인)에 즉시 반영.

---

## 2. Directory Structure (폴더 구조 설계)

Next.js App Router의 표준을 따르며, 기능(Feature) 단위로 모듈화합니다.

```bash
/
├── app/                        # Next.js App Router Root
│   ├── (auth)/                 # A. 인증 그룹 (레이아웃 분리)
│   │   ├── login/              # 로그인 페이지
│   │   ├── signup/             # 회원가입 페이지
│   │   └── onboarding/         # 프로필 초기 설정 (전공, 관심분야)
│   ├── (dashboard)/            # B, C, D 기능 그룹 (사이드바 레이아웃 공유)
│   │   ├── layout.tsx          # Dashboard Layout (Sidebar + Header)
│   │   ├── page.tsx            # B. 메인 대시보드 (Landing)
│   │   ├── matching/           # C. 연구자 매칭 서비스
│   │   │   ├── page.tsx        # 검색 및 리스트
│   │   │   └── [id]/           # 연구자 상세 프로필
│   │   └── resources/          # (Optional) 기타 메뉴
│   ├── api/                    # Backend API Routes (필요 시)
│   │   └── chat/               # D. 챗봇 API 엔드포인트
│   ├── globals.css             # Tailwind CSS Global
│   └── layout.tsx              # Root Layout
├── components/                 # 재사용 가능한 컴포넌트
│   ├── ui/                     # 버튼, 인풋 등 기본 UI (shadcn/ui)
│   ├── charts/                 # 차트 컴포넌트 모음 (Recharts)
│   │   ├── ProfessorDonut.tsx  # 교수 현황 도넛 차트
│   │   └── PlatformBar.tsx     # 6대 플랫폼 현황 바 차트
│   ├── dashboard/              # 대시보드 전용 위젯
│   └── chatbot/                # 챗봇 UI 컴포넌트
├── lib/                        # 유틸리티 함수 및 설정
│   ├── supabase.ts             # DB 클라이언트 설정
│   └── utils.ts                # Helper Functions
├── types/                      # TypeScript 타입 정의
│   └── database.types.ts       # DB 스키마 타입
└── middleware.ts               # 로그인 여부 체크 및 리다이렉트