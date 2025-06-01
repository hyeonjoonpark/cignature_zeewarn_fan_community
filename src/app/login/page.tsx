"use client";
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk, SiApple } from "react-icons/si";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F7FA]">
      <div className="bg-white p-8 rounded-xl shadow-md flex flex-col gap-6 w-80">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">로그인</h2>
        <button
          className="flex items-center justify-start gap-3 w-full py-3 rounded-lg border border-gray-200 font-semibold text-base bg-white hover:bg-gray-50 transition px-4 text-gray-900"
        >
          <FcGoogle className="text-2xl" />
          <span>구글로 로그인하기</span>
        </button>
        <button
          className="flex items-center justify-start gap-3 w-full py-3 rounded-lg font-semibold text-base bg-[#fee500] text-[#3c1e1e] border border-[#fee500] hover:bg-[#ffe94a] transition px-4"
        >
          <SiKakaotalk className="text-2xl" />
          <span>카카오톡으로 로그인하기</span>
        </button>
        <button
          className="flex items-center justify-start gap-3 w-full py-3 rounded-lg font-semibold text-base bg-black text-white border border-black hover:bg-gray-900 transition px-4"
        >
          <SiApple className="text-2xl" />
          <span>애플로 로그인하기</span>
        </button>
      </div>
    </div>
  );
} 