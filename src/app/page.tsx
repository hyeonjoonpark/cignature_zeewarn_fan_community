"use client";
import Image from "next/image";
import Link from "next/link";
import { boards } from "@/components/data/board_data";
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F7F7FA]">
      <nav className="sticky top-0 z-30 flex justify-between items-center px-8 py-4 bg-white/90 backdrop-blur border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-[#2563eb]">
            <a href="https://www.instagram.com/z._.warning/" target="_blank" rel="noopener noreferrer">@Z._.warning</a>
          </div>
          <span className="sr-only">시그니쳐 팬 커뮤니티</span>
        </Link>
        <div className="flex gap-8 text-base font-medium text-gray-800">
          <a href="#boards" className="hover:text-[#2563eb] transition">게시판</a>
          <a href="#notice" className="hover:text-[#2563eb] transition">공지사항</a>
          {!user && <Link href="/login" className="font-bold text-[#1d4ed8] hover:text-[#1d4ed8] transition">로그인</Link>}
          {!user && <Link href="/login" className="font-bold text-[#2563eb] hover:text-[#1d4ed8] transition">회원가입</Link>}
          {user && <Link href="/mypage" className="font-bold text-[#1d4ed8] hover:text-[#2563eb] transition">{user.name}</Link>}
        </div>
      </nav>

      <section className="relative flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-white border-b border-gray-100">
        <div className="mb-8">
          <Image
            src="/zeewon.jpeg"
            alt="시그니쳐 지원"
            width={120}
            height={120}
            className="rounded-full shadow border-2 border-[#DBEAFE] bg-[#F7F7FA]"
            priority
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2563eb] mb-3">시그니쳐 지원 팬 커뮤니티에 오신 것을 환영합니다!</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-7 max-w-xl mx-auto leading-relaxed">
          시그니쳐 지원을 사랑하는 팬들이 모여 소통하고 정보를 나누는 공간입니다.<br />
          지금 바로 가입하고 다양한 이벤트와 소식을 만나보세요!
        </p>
        {!user && (
          <Link
            href="/login"
            className="inline-block bg-[#2563eb] text-white px-8 py-2 rounded-lg font-semibold text-base shadow-sm hover:bg-[#1d4ed8] transition-all duration-200 focus:ring-2 focus:ring-[#60A5FA]"
          >
            회원가입하기
          </Link>
        )}
        {user && (
           <Link
             href="/mypage"
             className="inline-block bg-[#2563eb] text-white px-8 py-2 rounded-lg font-semibold text-base shadow-sm hover:bg-[#1d4ed8] transition-all duration-200 focus:ring-2 focus:ring-[#60A5FA]"
           >
             내 정보 보기
           </Link>
        )}
      </section>

      <section id="boards" className="flex flex-wrap justify-center gap-6 py-10 px-4 bg-[#F7F7FA]">
        {boards.map((board) => (
          board.href ? (
            <Link
              key={board.name}
              href={board.href}
              className="flex flex-col items-center gap-2 w-36 h-32 bg-white rounded-xl border border-gray-200 hover:border-[#2563eb] transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <div className="mt-6 mb-2 group-hover:scale-110 transition-transform">{board.icon}</div>
              <span className="font-semibold text-base text-gray-800 group-hover:text-[#2563eb] transition-colors">{board.name}</span>
            </Link>
          ) : (
            <a
              key={board.name}
              href={`#${board.name}`}
              className="flex flex-col items-center gap-2 w-36 h-32 bg-white rounded-xl border border-gray-200 hover:border-[#2563eb] transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <div className="mt-6 mb-2 group-hover:scale-110 transition-transform">{board.icon}</div>
              <span className="font-semibold text-base text-gray-800 group-hover:text-[#2563eb] transition-colors">{board.name}</span>
            </a>
          )
        ))}
      </section>

      <section className="flex flex-col md:flex-row justify-center gap-8 py-10 px-4 bg-white border-y border-gray-100">
        <div className="w-full max-w-xs mx-auto px-5">
          <h2 className="text-[#2563eb] text-lg font-bold mb-3 pb-2 border-b border-gray-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.556 0 8.25-1.768 8.25-3.938V6.938C20.25 4.768 16.556 3 12 3S3.75 4.768 3.75 6.938v9.374c0 2.17 3.694 3.938 8.25 3.938z" /></svg>
            인기글
          </h2>
          <ul className="space-y-0">
            {[ '오늘 시그니쳐 무대 짱이었어요!', '팬사인회 일정 공유합니다', '굿즈 나눔 이벤트 참여하세요!'].map((post, index, arr) => (
               <li
                 key={index}
                 className={`py-3 text-gray-800 ${index < arr.length - 1 ? 'border-b border-gray-200' : ''}`}>{`[분류] ${post}`}</li>
            ))}
          </ul>
        </div>
        <div className="w-full max-w-xs mx-auto px-5">
          <h2 className="text-[#2563eb] text-lg font-bold mb-3 pb-2 border-b border-gray-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2563eb]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" /></svg>
            최신글
          </h2>
          <ul className="space-y-0">
             {[ '오늘 찍은 직캠 공유해요', '신곡 너무 좋아요!', '공식 굿즈 구매처 안내'].map((post, index, arr) => (
                <li
                  key={index}
                  className={`py-3 text-gray-800 ${index < arr.length - 1 ? 'border-b border-gray-200' : ''}`}>{`[분류] ${post}`}</li>
             ))}
          </ul>
        </div>
      </section>

      <footer className="bg-white text-[#888] text-center py-5 text-sm mt-8 border-t border-gray-100">
        © 2024 시그니쳐 지원 팬 커뮤니티. All rights reserved.
      </footer>
    </div>
  );
}
