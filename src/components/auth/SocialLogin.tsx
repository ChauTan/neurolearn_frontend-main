import Image from 'next/image';
import { signIn } from 'next-auth/react';

const SocialLogin = () => (
  <div className="flex justify-center gap-4 mt-2">
    <button className="bg-white p-3 rounded-full hover:bg-gray-200 cursor-pointer">
      <Image
        src="/assets/home/Google.svg"
        alt="Google"
        width={16}
        height={16}
        onClick={() => signIn('google')}
      />
    </button>
  </div>
);
export default SocialLogin;
