"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 사용자 타입을 정의합니다 (실제 백엔드 모델에 따라 변경)
interface User {
  name: string;
  // 필요한 다른 사용자 정보 필드를 추가합니다.
}

// AuthContext의 값 타입을 정의합니다.
interface AuthContextType {
  user: User | null; // 로그인 상태 (User 객체 또는 null)
  setUser: (user: User | null) => void; // user 상태를 업데이트하는 함수
  loading: boolean; // 로그인 상태 로딩 중인지 나타내는 플래그
}

// AuthContext를 생성합니다. 기본값은 null로 설정하고, 사용 시 Provider로 감싸야 함을 명시합니다.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 컴포넌트: 로그인 상태를 관리하고 하위 컴포넌트에 제공합니다.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({name: "박현준"}); // user 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    setLoading(false);
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// useContext를 간편하게 사용하기 위한 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 