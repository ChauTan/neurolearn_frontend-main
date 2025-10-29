import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Certificate } from "@/types/certificate";
import { format } from "date-fns";
import { getUserById } from "@/lib/services/user";

interface CertificateCardProps {
    certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
    const [userAvatar, setUserAvatar] = React.useState<string>('/assets/images/avatar.png');

    React.useEffect(() => {
        const fetchUserAvatar = async () => {
            try {
                const userData = await getUserById(certificate.user._id);
                const user = userData.user || userData;
                if (user?.avatar?.url) {
                    setUserAvatar(user.avatar.url);
                }
            } catch (error) {
                console.error('Failed to fetch user avatar:', error);
            }
        };

        fetchUserAvatar();
    }, [certificate.user._id]);

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd MMM, yyyy');
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <Link href={`/certificate/${certificate._id}`} className="block">
            <div className="bg-white rounded-2xl p-4 relative overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition">
                {/* Certificate Image */}
                <div className="relative mb-4">
                    <Image
                        src="/assets/images/certificate.png"
                        alt="Certificate"
                        width={332}
                        height={233}
                        className="w-full object-cover rounded-xl"
                        priority
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-black font-bold text-lg drop-shadow-lg mt-5">
                            {certificate.userName}
                        </span>
                    </div>
                </div>

                {/* Course Info Card */}
                <div className="">
                    <div className="flex items-center justify-between text-blue-600">
                        <div className="flex items-center gap-2">
                            <Image src="/assets/icons/tag.svg" alt="Tag" width={30} height={30} />
                            <span className="text-base font-semibold">Course Certificate</span>
                        </div>
                        <div className="h-10 w-10 bg-[#F7F8FA] flex items-center justify-center rounded-xl">
                            <Image src="/assets/icons/menu.svg" alt="Menu" width={30} height={30} />
                        </div>
                    </div>
                    <div className="font-bold text-gray-800 text-xl my-3 leading-tight">
                        {certificate.courseName}
                    </div>
                    <div className="flex justify-between items-start text-xs text-gray-500">
                        <div className="flex flex-col">
                            <span className="text-sm mb-2">Certified Student</span>
                            <div className="flex items-center">
                                <Image
                                    src={userAvatar}
                                    alt="avatar"
                                    width={40}
                                    height={40}
                                    className="relative w-10 h-10 rounded-full ring-2 ring-white overflow-hidden bg-gray-200 flex items-center justify-center object-cover"
                                />
                                <span className="font-bold text-black ml-2">{certificate.userName}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm mb-4">Date received</span>
                            <span className="font-bold text-black">
                                {formatDate(certificate.completedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CertificateCard;
