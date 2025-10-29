import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <div className="-mt-4 mb-8 flex justify-center">
          <Image
            src="/assets/404/404.png"
            alt="Lost illustration"
            width={300}
            height={300}
            className="object-contain"
            priority
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Look like you&apos;re lost</h2>
        <p className="mt-2 text-sm text-gray-500">The page you are looking for is not available!</p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block rounded-md bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}