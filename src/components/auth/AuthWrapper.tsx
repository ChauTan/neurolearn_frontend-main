import Image from 'next/image';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-[700px] h-[450px] rounded-lg overflow-hidden shadow-xl flex">
      <div className="w-1/2 bg-white p-8 flex flex-col justify-center">{children}</div>
      <div className="w-1/2">
        <Image
          src="/assets/home/bg-authen.png"
          alt="Auth background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};
export default AuthWrapper;
