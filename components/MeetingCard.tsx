"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { avatarImages } from "@/constants";
import { toast } from "sonner";

interface MeetingCardProps {
    title: string;
    date: string;
    icon: string;
    isPreviousMeeting?: boolean;
    buttonIcon1?: string;
    buttonText?: string;
    handleClick: () => void;
    link: string;
}

export default function MeetingCard({
    icon,
    title,
    date,
    isPreviousMeeting,
    buttonIcon1,
    handleClick,
    link,
    buttonText,
}: MeetingCardProps) {
    return (
        <section className="flex min-h-[260px] w-full flex-col justify-between rounded-2xl bg-gray-800 backdrop-blur-lg px-6 py-8 shadow-xl border border-dark-3/40  hover:shadow-2xl">
            <article className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-dark-3 shadow-inner">
                        <Image src={icon} alt="meeting-icon" width={28} height={28} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                        <p className="text-base opacity-80">{date}</p>
                    </div>
                </div>
            </article>

            <article className="flex justify-between items-end mt-6">
                <div className="relative flex w-full max-sm:hidden">
                    {avatarImages.map((img, index) => (
                        <Image
                            key={index}
                            src={img}
                            alt="attendee"
                            width={44}
                            height={44}
                            className={cn(
                                "rounded-full ring-2 ring-dark-1 shadow-md transition-transform hover:scale-105",
                                index > 0 && "absolute"
                            )}
                            style={{ left: index * 32 }}
                        />
                    ))}
                    <div className="flex-center absolute left-[150px] size-11 rounded-full border-4 border-dark-3 bg-dark-4 cursor-pointer text-sm font-semibold shadow-md">
                        +5
                    </div>
                </div>

                {!isPreviousMeeting && (
                    <div className="flex gap-3">
                        <Button
                            onClick={handleClick}
                            className="rounded-xl bg-blue-1 hover:bg-blue-600 cursor-pointer "
                        >
                            {buttonIcon1 && (
                                <Image
                                    src={buttonIcon1}
                                    alt="feature"
                                    width={20}
                                    height={20}
                                />
                            )}
                            <span className="ml-2">{buttonText}</span>
                        </Button>

                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(link);
                                toast("Enlace copiado");
                            }}
                            className="rounded-xl bg-dark-2 cursor-pointer "
                        >
                            <Image src="/icons/copy.svg" alt="copy" width={20} height={20} />
                            <span className="ml-2 ">Copiar</span>
                        </Button>
                    </div>
                )}
            </article>
        </section>
    );
}
