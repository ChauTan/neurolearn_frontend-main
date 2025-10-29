'use client'

import React, { useEffect, useState } from 'react';
import { WithdrawForm } from '@/components/instructor/revenue/WithdrawForm';
import { BalanceOverview } from '@/components/instructor/revenue/BalanceOverview';
import { CardSection } from '@/components/instructor/revenue/CardSection';
import { TransactionHistory } from '@/components/instructor/revenue/TransactionHistory';
import { useModal } from '@/context/ModalContext';
import { useMemo } from 'react';
import { useGetTotalIncomeQuery } from '@/lib/redux/features/income/incomeApi';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const WithdrawDashboard: React.FC = () => {
  const { showModal } = useModal();

  const { data, isLoading, isError, refetch } = useGetTotalIncomeQuery();
  const [refreshKey, setRefreshKey] = useState(0);

  const income = useMemo(() => {
    return data?.income ?? 0;
  }, [data]);
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.role;
  const [ready, setReady] = useState(false);

  // Mark as client-ready to avoid hydration flicker
  useEffect(() => setReady(true), []);

  // Redirect when not instructor
  useEffect(() => {
    if (!ready) return;
    if (role === undefined) return;
    if (role !== 'instructor') {
      router.replace('/'); // send non-instructor to home
    }
  }, [ready, role, router]);


  const errorMessage = isError ? 'Không thể lấy dữ liệu thu nhập' : null;

  const handleAddCard = () => {
    console.log('Add new card');
    showModal('addBankCard');
  };

  const handleWithdrawSuccess = async () => {
    try {
      await refetch();
    } catch { }
    setRefreshKey(prev => prev + 1);
  };

  // Tính toán các giá trị
  const serviceFee = income * 0.1; // 10% của total income
  const currentBalance = income - serviceFee; // Số tiền có thể rút

  // Hàm format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  if (isLoading) {
    return <Loading message="Loading earnings..." className="min-h-screen" />;
  }
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'instructor') return <Loading message="Redirecting..." className="min-h-screen" />;
  return (
    <div className="min-h-screen" >
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 items-start w-full">
          {/* Left Section */}
          <section className="flex-1 min-w-[400px]">
            <WithdrawForm
              totalRevenue={errorMessage ? errorMessage : formatCurrency(income)}
              maxWithdrawAmount={currentBalance}
              onSuccess={handleWithdrawSuccess}
            />

            <BalanceOverview
              totalIncome={formatCurrency(income)}
              serviceFee={formatCurrency(serviceFee)}
              currentBalance={formatCurrency(currentBalance)}
            />
          </section>

          {/* Right Section */}
          <CardSection
            onAddCard={handleAddCard}
          />
        </div>

        <TransactionHistory refreshKey={refreshKey} />
      </main>
    </div>
  );
};

export default WithdrawDashboard;